const fs = require('fs'),
    async = require('async'),
    crypto = require('crypto'),
    mongo = require('mongoose'),
    sql = require('mysql');

var cookieProtection = false,
    instanceKeyProtection = false,
    stringMode = 'hex',
    candidates = [],
    instances = [],
    poll = '',
    Voter = [], 
    keys = [],
    VoterSchema,
    mysql = null,
    mysqldb = null,
    engine = false,
    logToFile = false,

    // Properties for cross-referencing voters
    securityTables = [      
        'browser_unique',
        'browser_cookie',
        'ip_address',
        'random_unique',
        'data'
    ];



// Main setup function responsible for establishing a database connection & setting program options
exports.setup = function (data, cb) {
    if ( typeof data == "string" ) var data = { db: data };

    cookieProtection = data.cookies?data.cookies:false;
    instanceKeyProtection = data.instance?data.instance:false;

    if (data.db.match(/(?:mongodb:\/\/)+/g)) {
        
        // Connect to MongoDB
        mongo.connect(data.db, { useMongoClient: true }, function(err) {
            engine = 'mongo';
            if (err && cb) cb({
                error: 500, 
                message: 'Increment can not connect to MongoDB! \n'+data.db + '\n' + err 
            });
            return
        });

    } else if (data.db.match(/(?:mysql:\/\/)+/g)) {
        
        // Connect to MySQL
        mysql = sql.createConnection(data.db);
        if ( mysql ) {
            mysqldb = data.db;
            mysql.connect();
            engine = 'mysql';
            return
        } else {
            if (cb) cb({ 
                error: 500, 
                message: 'Increment can not connect to MySQL! \n'+data.db + '\n' + err 
            });
            return
        }

    } else {
        if (cb) cb({ 
            error: 500, 
            message: 'Invalid database connection. Expecting url to match:\
                      mongodb://username:password@127.0.0.1:27017/collection or\
                      mysql://username:password@127.0.0.1:27017/db', 
            db: data.db 
        });
        return
    }
}

// Define a new poll and candidates.
// poll:        string             'USA'
// leaders:     object,array       [ 'Donald', 'Hillary' ]
exports.poll = function (poll, leaders, cb) {

    if (leaders && poll) {

        // Put leaders into an array of candidates
        candidates[poll] = new Array();

        if ( typeof leaders[0] == 'object' ) {

            // Loop through leaders and assign them to the poll
            async.each( leaders, function (leader) {
                if ( !leader.name ) cb('All candidates must have a name.');
                let identity = leader.name.replace(' ', '_').replace("'", '_').toLowerCase();
                candidates[poll].push({ name: leader.name, id: identity, color: leader.color });
            });

        } else if ( typeof leaders[0] == 'string' ) {

            // Loop through leaders and assign them to the poll
            async.each( leaders, function (leaderName) {
                let identity = leaderName.replace(' ', '_').replace("'", '_').toLowerCase();
                candidates[poll].push({ name: leaderName, id: identity, color: leader.color });
            });

        }
        
        // Create a voter schema
        var voterModel = this.schema(poll, candidates[poll]);

        if (cb) cb(null, voterModel, candidates[poll]);
        
    } else {
        cb('Expecting a name followed by an array of options');
    }
    
};

// Creating the blueprint for each vote to be cast (Mongo)
exports.schema = function (poll, leaders, cb) {
    
    keys[poll] = new Array();

    // Setup a voter table in MySQL
    if (engine == 'mysql') {
        
        // Generate all table properties, starting with these...
        var table = ["id MEDIUMINT NOT NULL PRIMARY KEY AUTO_INCREMENT", "time BIGINT"];
        async.each( leaders, function (leader) { // Leader names
            table.push( leader.id+" BOOLEAN" ); 
        });

        // Add security-related data tables ( browser_cookie, browser_instance, ip_address, etc.. )
        async.each( securityTables, function (protection) { 
            keys[poll].push( protection ); 
            table.push( protection+" TEXT" ); 
        });

        // Build the names into a query initializing the database
        var columns = table.join(),
            query = "CREATE TABLE "+poll+" ("+columns+")";

        mysql.query(query, function(err, results) {

            // If the table already exists, redescribe it in the database if needed
            if (err && err.code =='ER_TABLE_EXISTS_ERROR') {
                mysql.query("DESCRIBE "+poll, function(err, description) {

                    // Find the colum name for each element in the SQL structure
                    let columns = new Array();
                    async.each(description, function(columnName, callForward) {

                        columns.push(columnName.Field);
                        callForward();

                    }, function() {

                        /*
                         * Updating the MySQL database structure.
                         * Add additional columns to the database when 
                         * candidates or security tokens have been changed.
                        **/ 

                        let structure = new Array('id', 'time', 'ballot');
                        async.each( candidates[poll], function(candidate) {
                            structure.push( candidate.id );
                        });
                        async.each( keys[poll], function(key) {
                            structure.push( key );
                        });                   

                        // Select new columns to be prvisioned to the MySQL database.
                        for (var i = 0; i <= columns.length; i++) { 
                            for (var e = 0; e <= structure.length; e++) { 
                                if ( columns[i] && structure[e] && structure[e] == columns[i] )
                                    structure.splice( e, 1 );
                            }
                        }

                        if ( structure.length > -1 ) {
                            
                            let rules = new Array();
                            async.each( structure, function(column) {
                                rules.push(' ADD COLUMN '+column+' TEXT');
                            });

                            if ( rules.length > 0 ) {
                                rules = rules.join(rules);
                                mysql.query("ALTER TABLE " + poll + rules, function(err, results) {
                                    cb(err, results);
                                });
                            }
                        }

                    });
                });
            } else { if(cb) cb(err, results); }

        });
        
        return;

    // Create a Mongo schema
    } else if (engine == 'mongodb') {

        let schema = {
            identity: { type: String, required: true },
            name: { type: String, required: true },
            poll: { type: String, required: true },
            time: { type: String, required: true }
        }

        // Add security-related data tables
        async.each( securityTables, function (protection) {
            keys[poll].push( protection );
            schema.push( protection+": { type: String, required: true }"); 
        });

        // Model a voter with the scheme
        VoterSchema = new mongo.Schema(schema);

        // Setup the voter collection and define the schema name twice to prevent auto pluralization
        Voter[poll] = mongo.model(poll, VoterSchema, poll);    
        
        cb(flase, Voter[poll]);

        return;

    }
}



// The function to receive and set vote
exports.vote = function (a, b, c) { 
    
    /*  Input variables for casting vote:
    $   a    string / object      String:   poll                     Object: { name: #candidate, poll: #election }
    $   b    string / function    String:   candidate                Funciton: callback( result )
    $   c    function (optional)  Function: callback( result )
    */

    // Reject empty submissions
    if (!a) b('No vote was defined.');
    
    // Parse the body of an app Express request
    if (a.body) a = a.body; // TODO
    
    // Accept browser information data to add to a vote
    if (!a.data) a.data = 0; // TODO

    // Check if a browser instance key is required ( prevent refresh-flooding )
    if (!a.instance && instanceKeyProtection) b('No instance key was defiend.');

    // Handle a ('vote', 'poll', callback) format call
    if (typeof a == 'string') {
        var a = {
            name: b,
            poll: a
        }
        b = c;
    }
    
    // Check the instance key and cookie for resubmission. 
    // If there was vote found, send it back in a variable.
    this.checkKey(a, function(fraudulent, previousVote) {


        if (fraudulent == true && b) b('A previous vote was found in this poll.', previousVote);

        var date = new Date();
            a.time = date.getTime()

        var buffer = crypto.randomBytes(48);
            a.random_unique = buffer.toString(stringMode);

        /*  
            An SQL query is created by looping through leaders and key names.
            Ballot 'name' data is matched with candidates in the 'poll' to create a boolean result.
            The result is recorded within MySQL my inserting a new row in poll's table.

            An example SQL query generated for one vote Red:
            "   
                INSERT INTO elections 
                ('time','data','red','blue','cookie','ip') 
                ('2017-12-31', '${DATA}', 1, 0, 'RANDOMCOOKIE', '127.0.0.1');
            "
        */

        if (engine == 'mysql') {

            // Ballot Columns
            var table = ['time', 'ballot'];
            
            // Push candidate names to the table
            async.each( candidates[a.poll], function (name) { 
                table.push( name.id ); 
            });

            // Append security keys to the row
            async.each( keys[a.poll], function (key) {
                table.push( key );
            });

            // Define a Ballot: [ time, [candidates], [security keys] ]
            var ballot = ['"'+a.time+'"', '"'+a.poll+'"'];

            // Mark each candidate
            async.each(candidates[a.poll], function( candidate ) {
                if ( candidate.name == a.name ) ballot.push( '"1"' ); 
                if ( candidate.name != a.name ) ballot.push( '"0"' );
            });
            
            // Salt each security key
            async.each( keys[a.poll], function (key) {
                let secret = 0;
                if (a[key]) secret = a[key]; // TODO
                ballot.push( '"'+secret+'"' );
            });

            // Build the names into a query initializing the abase
            var columns = table.join(),
                row = ballot.join();
                
                // Run MYSQL
                mysql.query( "INSERT INTO "+a.poll+" ("+columns+") VALUES("+row+")", b );

        } else if (engine == 'mongodb') {

            //  Insert entry into MongoDB
            Voter[a.poll].create({
                identity: a.identity,
                name: a.name,
                poll: a.poll,
                time: a.time,
                random_unique: a.random_unique,
                browser_cookie: a.browser_cookie,
                browser_unique: a.browser_unique,
                ip_address: a.ip_address,
                data: a.data
            }, b );


        }
    
    });

};


/* Statistics 
 $  polls     array / string        Name of poll to get statistics for
*/

exports.statistics = function (polls, cb) {
    var errors = new Array();
    var results = new Array();
    

    // Requesting just one poll's statistics.
    if (typeof polls == 'string') {
        if (!candidates[polls]) cb('Cannot create statisitcs! Poll "'+polls+'" has not beed defined.');
        this.countVotes(polls, cb);
    } else {

    // Return data for all polls that are listed in an array
         async.each( polls, function ( poll, callback ) {
            this.countVotes(poll, function (err, statistics) {
                if (err) errors.push(err);
                results.push(statistics);
            });
        }, function(results) {
            if (cb) cb(errors, results);    
        });

    } 
    
};


/* Count votes */
exports.countVotes = function (poll, cb) {
    
    var statistics = new Array();

    /* Main Count Loop */
    async.each( candidates[poll], function ( candidate, callback ) {
        
        if ( engine == 'mysql' ) {

            // Generate a new SQL query for all votes                               1 ( BOOOEAN )
            mysql.query("SELECT COUNT(*) FROM " + poll + " WHERE "+candidate.id+" = 1", function (err, count) {
                candidate.count = count[0]['COUNT(*)'];
                statistics.push(candidate);
                callback(statistics);
            });

        } else if ( engine == 'mongodb' ) {

            // Find all votes for a candidate in the Mongo database
            Voter[poll].count({ poll: poll, name: candidate.name }).sort({ "time": -1 }).exec(function (err, count) {
                if (err) cb(err);
                // Write the total vote count to the statistics array
                candidate.count = count;
                statistics.push(candidate);
                if (statistics.length == candidates[poll].length) callback(statistics);
            });

        }

    // Async finish...
    }, function (statistics) {
        
        // A new variable to hold vote calculation data
        var calculations = { poll: poll, candidates: [], total: 0 };
        
        if ( engine == 'mysql' ) {

            // Count all votes with candidate names 
            let candidateKeys = new Array(), condition = '', a=0;
            async.each( candidates[poll], function ( candidate ) {
                let argument = ( a > 0 ) ? " OR " : ""; a++;
                condition = condition + argument + candidate.id + " = 1";
            });

            // Global vote count generated from candidate name conditions: "apple = 1 OR orange = 1 OR banana = 1"
            mysql.query("SELECT COUNT(*) FROM " + poll + " WHERE " + condition, function (err, count) {

                calculations.total = count[0]['COUNT(*)'];
                
                // Run calculations for each candidate
                async.each( statistics, function ( statistic ) {

                    // Create a percentage for each candidate
                    statistic.percentage = 0;
                    if (statistic.count > 0) {
                        statistic.percentage = statistic.count/calculations.total;
                        statistic.percentage = (statistic.percentage*100).toFixed(0);
                    }

                    // Assign the leading candidate
                    if (!calculations.projectedWinner || statistic.count >= calculations.projectedWinner.count) {
                        calculations.projectedWinner = statistic;  
                    }

                    // Add this statistic to the calculations
                    calculations.candidates.push(statistic);
                });

                cb(err, calculations);

            });
        } 

        if ( engine == 'mongodb' ) {
            // Count total votes with Mongo database
            Voter[poll].count({ poll: poll }).exec(function (err, count) {
                if (err) throw (err);
                calculations.total = count;
                
                // Run calculations for each candidate
                async.each( statistics, function ( statistic ) {

                    // Create a percentage for each candidate
                    statistic.percentage = 0;
                    if (statistic.count > 0) {
                        statistic.percentage = statistic.count/calculations.total;
                        statistic.percentage = (statistic.percentage*100).toFixed(0);
                    }

                    // Assign the leading candidate
                    if (!calculations.projectedWinner || statistic.count >= calculations.projectedWinner.count) {
                        calculations.projectedWinner = statistic;  
                    }

                    // Add this statistic to the calculations
                    calculations.candidates.push(statistic);
                });

                cb(err, calculations);

            });
        }

    });
};




// Check if the user has already voted. Return a boolean and vote data if found
exports.checkKey = function (vote, callback) {
    if (vote.unique) vote.cookie = vote.unique
    if (vote.browser_cookie) vote.cookie = vote.browser_cookie
    if (vote.browser_unique) vote.instance = vote.browser_unique
    if (vote.browser_instance) vote.instance = vote.browser_instance

    if ( vote.instance && instances.indexOf(vote.instance) > -1 ) {

        if ( vote.unique ) {

            // Strike instance keys to save RAM !
            if ( instanceKeyProtection ) {
                var index = instances.indexOf(vote.instance);
                instances = instances.splice(index, 1);
            }

            // Look for existing votes in MySQL
            if ( engine == 'mysql' ) {

                let pollKeys = new Array();
                async.each( keys[vote.poll], function( key ) {
                    if( vote[key] ) pollKeys.push(key+" = "+vote[key]);
                });

                let keys = pollKeys.join();
                mysql.query( "SELECT FROM "+vote.poll+" WHERE "+keys, function(err, docs) {
                    console.log(err, docs);
                });

            } 

            // Look for existing votes in Mongo
            if ( engine == 'mongodb' ) {

                Voter[vote.poll].findOne({ unique: vote.unique }, function (err, voter) {
                    if (err) throw (err);

                    // Send true if a previous vote was found
                    if ( voter ) {
                        callback(cookieProtection, voter);
                    } else {
                        callback(false, false);
                    }
                });
            }

        // Assign candidates
        } else {
            // Could not find a valid cookie
            callback(cookieProtection, false);
        }
    } else {
        callback(instanceKeyProtection, false);
    }

}




/* Check if the user has already voted
 $ keys         string / array 		   Cookie, IP, or instance keys to match agaist existing database */
exports.voted = function (keys, callback) {
	if ( keys.length > 0 ) { 
	
    	let votesFound = new Array();
		async.each(keys, function (key)	{ 
	        
            // Check instances array for the 
    		if ( instances.indexOf(key) > -1 ) votesFound.push(key);
	        
            Voter[vote.poll].findOne({ unique: key }, function(err, vote) {
				if ( err ) callback({ error: err }, votesFound);
				votesFound.push(vote);
			});
		    
            Voter[vote.poll].findOne({ ip: key }, function( err, vote ) {
				if ( err ) callback({ error: err }, votesFound);
				votesFound.push(vote);
			});
		});
		callback(false, votesFound);
	} else {
	        if ( instances.indexOf(key) > -1 ) callback(false, { voted: true, key: 'instance' });
        	Voter[vote.poll].findOne({ unique: key }, callback);
	        Voter[vote.poll].findOne({ ip: key }, callback);             
	}
}


// Create a random string and add it to the array of valid instances allowed to vote
exports.getInstance = function (cb) {
    crypto.randomBytes(48, function(err, buffer) { // Crypto lib output =>
        let newInstance = buffer.toString(stringMode);
        instances.push(newInstance);
        if(cb) cb(newInstance); // <= Returns 48 random bytes
        return newInstance;
    });
}
