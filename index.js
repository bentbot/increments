/* Define Canidates */
const candidates = [
    { name: 'Liam PAYNE', color: 'green' },
    { name: 'Brittney SPEARS', color: 'red' },
    { name: 'Kanye West', color: 'purple' },
    { name: 'Katy Perry', color: 'blue' },
    { name: 'Avril Lavine', color: 'pink' }
];

/* The name of the poll */
var poll = 'vma'; 


/* Include and setup Increments */
const increments = require('./lib/increments');

/* Increments accepts a MySQL and MongoDB database. */
increments.setup('mysql://increments:increment@localhost:3306/polls', function (err) {
    if (err) throw (err);
    console.log('Connecting to Database');
});

// Add a poll with the above constants 
increments.poll(poll, candidates);


/* Start webserver */ 

var webPort = 8000;
var ioPort = 3000;

var express = require('express');
var app = express(); 
var async = require('async');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var pug = require('pug');

// Receive votes by accepting a posted message using bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Prevent double submissions by checking cookies with cookieParser
app.use(cookieParser());

// Add some template support
app.set('view engine', 'pug');
app.use(express.static('views'))



/* Generate the voting screen located at localhost:8000 */
app.get('/', function(request, responce) {
    
    /* Increments can create a unique browser key
    /* Return the instance key within the POST data of a vote using the
    /* The easiest way is to use a hidden field with the name='instance' */
    
    increments.getInstance(function (instance) {        
        
        increments.statistics(poll, function (err, results) {
        
            // Send the template with the defined candidates & the returned instance key 
            responce.render('index', {candidates: candidates, instance: instance, statistics: results });
        
        });

    });    
    
});



// GET redirect to root
app.get('/vote', function(request, responce) {
	responce.redirect('/');
});


// The POST endpoint to receive a vote
app.post('/vote', function(request, responce) { 
    
    /* Increments accepts an object with the following items:
    /
    /* 'name'       The candidate or option you are voting for
    /* 'poll'       A poll identifier you have already defined
    /* 'instance'   The variable generated with getInstance
    /
    /  Voting is accomplished first by creating an object 'ballot' with a name and a poll
    /  Pass the instance value if necessary, then execute increments.vote(ballot)
    */
    
    var ballot = {
        name: request.body.vote,             // name of candidate (input name="vote")
        poll: poll,                          // the name of the poll ('elections')
        instance: request.body.instance      // hidden input (name="instance")
    }
    
    /* Increments accepts the object and sends a responce to Express. */
    increments.vote(ballot, function(err, data) {
        if (err) throw (err);
        responce.redirect('/statistics');
    
        increments.statistics(poll, function (err, results) {
            if (err) throw (err);
            io.sockets.emit('statistics', results);
        })

    });


    
});

// Display the statistics page
app.get('/statistics', function( request, responce ) {
    
    /* Increments will return statistics with increments.statistics
    /* Data is returned in JSON and rendered to the template.*/
    
    increments.statistics(poll, function (err, results) {
        if (err) throw(err);
        responce.render('statistics', { statistics: results } );
    });
    
});

// API GET Request
app.get('/statistics/data', function( request, responce ) {
    
    /* Increments can return RESTfully to an API */
    increments.statistics(poll, function (err, results) {
        if (err) throw (err);
        responce.send(results);
    });
    
});


// Start the webserver
var chalk = require('chalk');
app.listen(webPort);
console.log(chalk.green.bold('Server started listening on port: '+webPort))

var io = require('socket.io')(ioPort);
// Send statistical data to IO instantly 
