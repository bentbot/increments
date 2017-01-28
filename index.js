/* Define Canidates */
var candidates = [
    {name: 'Donald Trump', color: 'red'},
    {name: 'Hillary Clinton', color: 'blue' } 
]

/* Protection */

// Cookies allow a web browser to cast only one ballot.
// Keep in mind that cookies can be spoofed or cleared which can lead to false votes.
var enableCookieProtection = false;

// Add a hidden key to each browser instance ignore double-posts
var enableInstanceKeyProtection = true;

// Security settings
var randomBytesLength = 48;
var randomBufferString = 'hex';


/* Start the database connection */
var db = require('mongoose');
db.connect('mongodb://increment:inc@127.0.0.1:27017/increment');


// Model a single voter with this database scheme
var VoterSchema = new db.Schema({
    vote: { type: String, required: true },
    ipaddr: { type: String, required: true },
    unique: { type: String, required: true },
    time: { type: Date, default: Date.now }
});


// Create a trigger to save the vote to a log file
var fs = require('fs');
VoterSchema.pre('save', function (next) {
    var vote = this;

    // Save votes to a backup file before adding them to the database
    fs.readFile('logs/votes.json', function (err, buffer) {
        if (err) throw (err);
        if (buffer) buffer = buffer+vote+',\n';
        fs.writeFile('votes.json', buffer, function (err) {
            next();
        });
    });

});

// Save the voter scheme
var Voter = db.model('voters', VoterSchema);
    
/* Start Client Webserver */ 
var express = require('express');
var async = require('async');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var pug = require('pug');
var app = express(); 
var instances = [];

// Receive votes by accepting a posted message with bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Prevent double submissions by checking cookies with cookieParser
app.use(cookieParser());

// Add template support
app.set('view engine', 'pug');

// Serve static template files
app.use(express.static('views'))

// Display the voting screen
app.get('/', function(request, responce) {
    getInstance(function (instance) {        
        // Send the template
        responce.render('index', {candidates: candidates, instance: instance });
    });

});


app.get('/vote', function(request, responce) {
	responce.redirect('/');
});

// The endpoint to receive a vote
app.post('/vote', function(request, responce) { 

    // Reject empty submissions
    if (!request.body.vote) responce.redirect('/');
    
    // Check if the client has already voted
    if (request.body.vote) checkKey(request, function(fraudulent, vote) {


        if (fraudulent == true) {
            getInstance(function (instance) {
                // Send the template
                responce.render('index', {candidates: candidates, instance: instance, error: true, votes: vote });
            });
        }

        if (fraudulent == false) {

            // Generate a unique identifier
            require('crypto').randomBytes(randomBytesLength, function(err, buffer) {
                var uniqueKey = buffer.toString(randomBufferString);

                // Create a virtual ballot
                var ballot = new Voter({
                    ipaddr: request.ip,
                    unique: uniqueKey,
                    vote: request.body.vote
                });


                // Save the unique ballot to the database
                ballot.save( function (error) {
                    if (error) throw (error);
                        
                        // Add the unique cookie to the user's browser...
                        if (enableCookieProtection) responce.cookie('key', uniqueKey, { maxAge: 605000000 });
                         responce.send('ok');

                        // Send a receipt of the vote
                        //responce.render('index', { vote: request.body.vote });

                });
            });

        } // End fraudulent check
    });


});

app.get('/statistics', function( request, responce ) {
    countVotes(function (err, statistics) {
        if (err) throw (err)        

        // Send a receipt of the vote
                responce.render('index', {
            candidates: candidates,
            statistics: statistics
        });

    });
});


// Start the webserver
app.listen(8000);


/* Count votes */
function countVotes(cb) {
    
    // Create an empty statistics array
    var statistics = [];
    
    // For each candidate
    async.each( candidates, function ( candidate, callback ) {
        // Find the candidate's name
        var name = candidate.name;
        // Find all votes for a candidate in the database
        Voter.count({ vote: name }, function (err, increments) {
            if (err) call(err);
            var percentage = 0;

            // Write the total vote count to the statistics array
            statistics.push({
                count: increments,
                name: name,
                color:  candidate.color,
                percentage: 0
            });

            // Trigger the next function
            callback(err)
        });
    }, function (err) {
        // Check for errors
        if (err) throw (err);
        // A new calculation
        var calculations = { candidates: [], total: 0 };
        
        // Count total votes
        Voter.count({}, function (err, total) {

            // Run calculations for each candidate
            async.each( statistics, function ( statistic ) {
		if (statistic.count > 0) {
	                // Create a percentage for each candidate
        	        statistic.percentage = statistic.count/total;
               		 statistic.percentage = (statistic.percentage*100).toFixed(1);
		}
                // Push the statistic to the calculation
                calculations.candidates.push(statistic);
            });

            // Add the total iterations to the result
            calculations.total = total;

             // Return a final count
                    cb(err, calculations);
        });

    });
}

/* Check if the user has already voted */
function checkKey(request, callback) {
    
    if ( request.body.instance ) {
        var instance = request.body.instance;

        if ( instances.indexOf(instance) > -1 ) {
            var index = instances.indexOf(instance);
            instances = instances.splice(index, 1);
            if ( request.cookies.key ) {
                // Try to find a vote with the cookie key if it exists
                Voter.findOne({ unique: request.cookies.key }, function (err, voter) {
                    if (err) throw (err);

                    // Send true if a previous vote was found
                    if ( voter ) {
                        callback(enableCookieProtection, voter);
                    } else {
                        callback(false, false);
                    }
                });
            } else {
                // Could not find a valid cookie
                callback(false, false);
            }
        } else {
            callback(enableInstanceKeyProtection, false);
        }
    }
}


function getInstance(cb) {
    require('crypto').randomBytes(randomBytesLength, function(err, buffer) {
        var instance = buffer.toString(randomBufferString);
        instances.push(instance);
        cb(instance);
    });
}
