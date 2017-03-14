const fs = require('fs'),
    async = require('async'),
    crypto = require('crypto'),
    db = require('mongoose');

var enableCookieProtection = false,
    enableInstanceKeyProtection = false,
    randomBytesLength = 48,
    stringMode = 'hex',
    candidates = [],
    instances = [],
    poll = '',
    Voter = [], 
    VoterSchema,
    logToFile = false;


// Main setup function responsible for establishing a database connection & setting program options
exports.setup = function (data, cb) {
    if ( typeof data == "string" ) var data = { db: data };
    if (data.db.match(/(?:mongodb:\/\/)+/g)) {
    	
        // Connect to MongoDB
        db.connect(data.db, {}, function(err) {

            if (err && cb) cb('Increment can not connect to MongoDB! \n'+data.db + '\n' + err );

    	    // Add setup variables to global program
    	    if (data.cookies) enableCookieProtection = data.cookies;
    	    if (data.instance) enableInstanceKeyProtection = data.instance;
    	    if (data.keyLength) randomBytesLength = data.keyLength;
            
        });

	} else {
		if (cb) cb({ error: 500, message: 'Invalid database connection. Expecting url to match: mongodb://username:password@127.0.0.1:27017/collection', db: data.db })
	}
}


// Creating the blueprint for each vote to be cast
exports.schema = function (poll, cb) {

    // Setup a voter schema
    var defaultSchema = {
        poll: { type: String, required: true },
        name: { type: String, required: true },
        data: { type: String, required: false },
        ipaddr: { type: String, required: false },
        unique: { type: String, required: enableCookieProtection },
        time: { type: Date, default: Date.now }
    };


    // Model a voter with the scheme
    VoterSchema = new db.Schema(defaultSchema);

    // Setup the voter collection and define the schema name twice to prevent auto pluralization
    Voter[poll] = db.model(poll, VoterSchema, poll);    

    return defaultSchema;

}



// Responsible for defining a new poll, identified by name.
exports.poll = function (poll, options, cb) {

    if (options && poll) {

        if ( typeof options[0] == 'object' ) {
            candidates[poll] = options;
        } else if ( typeof options[0] == 'string' ) {
            candidates[poll] = new Array();
            async.each( options, function (option) {
                candidates[poll].push({
                    name: option
                });
            });
        }
        
        // Assign candidates
    	
        
        // Create a voter schema
        var voterModel = this.schema(poll);

        if (cb) cb(null, voterModel, candidates[poll]);
        
    } else {
    	cb('Expecting a name and a array of options');
    }
    
};

// Create a random string and add it to the array of valid instances allowed to vote
exports.getInstance = function (cb) {
    crypto.randomBytes(randomBytesLength, function(err, buffer) {
        var instance = buffer.toString(stringMode);
        instances.push(instance);
        
        cb(instance);
        return instance;
    });
}


// The function to receive and set vote
exports.vote = function (data, cb, eb) { 
    
    // TODO: Match by name, color, or any unqiue keys
    //if data.key is found in candidates.key
    //push this candidate to var data...

    // Reject empty submissions
    if (!data) cb('No vote was defined.');
    
    // Parse the body of an Express request
    if (data.body) data = data.body;

    // Check if instance key is required
    if (!data.instance && enableInstanceKeyProtection) cb('No instance key was defiend.');

    // Handle a ('vote', 'poll', callback) format call
    if (typeof data == 'string') {
        var data = {
            name: cb,
            poll: data
        }
        cb = eb;
    }
    
    // Check the instance key and cookie for resubmission
    this.checkKey(data, function(fraudulent, previousVote) {

        if (fraudulent == true && cb) cb('A previous vote was found in this poll.', previousVote);

        var buffer = crypto.randomBytes(randomBytesLength);
        var uniqueKey = buffer.toString(stringMode);

        Voter[data.poll].create({
            unique: uniqueKey,
            name: data.name,
            poll: data.poll,
            data: data.data 
        }, cb );
            
    
    });

};

exports.statistics = function (poll, cb) {
    var errors;
    var results = [];
    
    if (typeof poll == 'string') {
        if (!candidates[poll]) cb('Cannot create statisitcs! Poll "'+poll+'" has not beed defined.');
        this.countVotes(poll, function (err, statistics) {
            if (err) errors.push(err);
            if (cb) cb(errors, statistics);
        });
    } else {
        for (var i=0; i <= poll.length-1; i++) {
             this.countVotes(poll[i], function (err, statistics) {
                 if (err) errors.push(err);
                 if (cb) cb(errors, statistics);
             });
            
        }
        
    } 
    
};



/* Count votes */
exports.countVotes = function (poll, cb) {
    
    // Create an empty statistics array
    var statistics = [];
    
    // For each candidate...
    async.each( candidates[poll], function ( candidate, callback ) {
        
        // Create a statistic for this candidate
        var statistic = candidate;
        
        // Find this candidate's name
        var candidateID = candidate.name.replace(' ', '_').replace("'", '_').toLowerCase();
        
        // Find all votes for a candidate in the database
        Voter[poll].count({ poll: poll, name: candidate.name }, function (err, count) {
            if (err) cb(err);

            // Write the total vote count to the statistics array
            statistic.count = count;
            statistic.id = candidateID;
            statistic.percentage = 0;
            
            // Add this candidate's increments to the statisitcs array
            statistics.push(statistic);

            // Trigger the next async function
            callback(err)
        });
    }, function (err) {
        // Check for errors
        if (err) cb(err);
        
        // A new calculation
        var calculations = { poll: poll, candidates: [], total: 0 };
        
        // Count total votes
        Voter[poll].count({ poll: poll }, function (err, total) {

            // Run calculations for each candidate
            async.each( statistics, function ( statistic ) {
                
        		if (statistic.count > 0) {
        	        // Create a percentage for each candidate
                	statistic.percentage = statistic.count/total;
                    statistic.percentage = (statistic.percentage*100).toFixed(1);
        		}


                // Assign  the leading candidate
                if (!calculations.projectedWinner || statistic.count > calculations.projectedWinner.count) {
                  calculations.projectedWinner = statistic;  
                } 

                // Add this statistic to the calculations
                calculations.candidates.push(statistic);
            });

            // Add the total iterations to the result
            calculations.total = total;
            
            // Return a final count
            if (cb) cb(err, calculations);
        });

    });
}

// Check if the user has already voted
exports.checkKey = function (vote, callback) {

    if ( vote.instance && instances.indexOf(vote.instance) > -1 ) {
        var index = instances.indexOf(vote.instance);
        instances = instances.splice(index, 1);
        if ( vote.unique ) {
            // Try to find a vote with the cookie key if it exists
            Voter[vote.poll].findOne({ unique: vote.unique }, function (err, voter) {
                if (err) throw (err);

                // Send true if a previous vote was found
                if ( voter ) {
                    callback(enableCookieProtection, voter);
                } else {
                    callback(false, false);
                }
            });

            // Assign candidates
        } else {
            // Could not find a valid cookie
            callback(enableCookieProtection, false);
        }
    } else {
        callback(enableInstanceKeyProtection, false);
    }

}

