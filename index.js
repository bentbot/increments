const increment = require('./lib/increments');

/***
 * Setup
***/

// Connect to a MongoDB database. Collections will be created to contain poll data.
var db = 'mongodb://increment:inc@localhost:27017/increment';
increment.setup(db, function (err, data) {
    if (err) throw (err);
});


// Define candidates or poll options
const candidates = [
    { name: 'Conservatives', color: 'blue' },
    { name: 'Liberals', color: 'red' }
];


// Use increment to create a poll with a collection name and an array of options.
increment.poll('CanadianElection', candidates, function (err, model, candidates) {
	if (err) throw (err);
	//console.log(model);
	//console.log(candidates);
});

/***
 * Voting
***/

// Create a vote object
var vote = {
	poll: 'CanadianElection',
	name: 'Liberals',
	data: 'true'
};

// Send the vote to increment. It returns either an error or the database entry.
increment.vote(vote, function(err, results) {
    if (err) throw (err);
    if (results.data == 'true') console.log('Voted ' + results.name);
    
    /***
     * Generating Statistics
    ***/

    // Increment will show statistics when given the name of a poll
    increment.statistics('CanadianElection', function(err, data) {
        if (err) throw (err);
        console.log(data);
        console.log('Projected Winner: ' + data.projectedWinner.name);
    });

});

// Note that in this case running increment.statistics outside of the vote callback function
// does not allow you to calculate the latest vote, because of Node's asynchronous operation. 