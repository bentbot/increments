/* Define Canidates */
const candidates = [
    { name: 'Hillary Clinton', color: 'blue' },
    { name: 'Donald Trump', color: 'red' }
];

/* The name of the poll */
var poll = 'elections';


/* Include and setup Increments */
const increments = require('./lib/increments');

/* Increments secure settings */
increments.setup({ 
    db: 'mongodb://increment:inc@localhost:27017/increment',
    cookies: true, // Enable unique voting cookies
    instance: true, // Require instance keys to vote 
}, function (err) {
    if (err) throw (err);
    console.log('Connecting to Database: mongodb://increment:inc@localhost:27017/increment');
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

// Receive votes by accepting a posted message with bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Prevent double submissions by checking cookies with cookieParser
app.use(cookieParser());

// Add template support
app.set('view engine', 'pug');
app.use(express.static('views'))



// Display the voting screen
app.get('/', function(request, responce) {
    
    /* Increments can return an instance code with increments.getInstance
    /* Just return the instance code within the POST data of a vote.
    /* The easiest way is to use a hidden field with the name='instance' */
    
    increments.getInstance(function (instance) {        
        // Send the template with the defined candidates & the returned instance key 
        responce.render('index', {candidates: candidates, instance: instance });
    });
    
});



// GET redirect to root
app.get('/vote', function(request, responce) {
	responce.redirect('/');
});


// The POST endpoint to receive a vote
app.post('/vote', function(request, responce) { 
    
    var ballot = {
        instance: request.body.instance,
        name: request.body.name
    }
    
    /* Increments accepts a request object directly from Express. */    
    increments.vote(ballot, function(err, data) {
        if (err) throw (err);
        responce.send(data);
    });
    
});

// Display the statistics page
app.get('/statistics', function( request, responce ) {
    
    /* Increments will return statistics with increments.statistics
    /* Data is returned in JSON and rendered to the template.*/
    
    increments.statistics(poll, function (err, results) {
        responce.render('index', { statistics: results } );
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
//io.sockets.emit('statistics', calculations);