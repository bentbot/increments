/*** 
 * Voting Application Setup 
 ***
 * Please begin by running:
 **
 * > npm install
 **
 * And run this application using one of the following commands:
 **
 * > node index.js
 **
 * This will start your voting server and generate a URL and port to visit.
 *
***/




	const increments = require('increments');

	/* Name the poll: */

	const poll = 'canadian_election_2020';
	const title = 'Federal Election';
	const prompt = 'Who would you vote for in the Canadian federal elections?';

	/* Define the running candidates: */

	let candidates = [
		{id: 'ndp', name: 'New Democratic Party', color:'orange'},
		{id: 'green', name: 'Green Party', color:'green'},
		{id: 'bloc', name: 'Bloc Québécois', color:'skyblue'},
		{id: 'liberal', name: 'Liberal Party', color:'red'},
		{id: 'conservative', name: 'Conservative Party', color:'blue'},
		{id: 'peoples_party', name: "People's Party", color:'purple'}
	];

	/* Connect to a MYSQL database:  */

	increments.setup({
		db:"mysql://canadian_demo:DemoPassword@canadianelections.janglehost.com/canadian_demo",
		roundMode: 'hundredth', // These are different rounding modes: float/floor/round/pure/tenth/hundredth/auto
		instance:false,
		cookies: false
	});





	/*** Settings ***/
	
	let IPAddressProtection		= false; // Stop double-voting by IP Addr?
	let CookieProtection		= false; // Stop double-voting using browser cookies?
	let AllowRevoting			= true;	// Cookie and IP protection required to be set to `false`.
	
	let AllowViewSource			= true; // Allow users to view the application source code.
	let AllowDataExport			= true;	// Allow users to view exported JSON data.
	let AllowStatistics			= true; // Allow users to view the live statistics
	let SecureSocket			= false; // Use a https:// secure websocket. May req. cetificates.
	let WebPort 				= 8080; // Web port to connect a browser to. Like http://localhost:8080
	let WebSocketPort			= 3300; // Web socket port used to connect to any browsers.
	let RunBuild 				= true; // Automatically run `ng build` upon startup. Set to `false` in production.
	let Debug 					= false;

	/* Time to start the polling application */


	increments.poll( poll, candidates, function (err, model, candidates) {
		if(Debug)console.log(model);
	}, Debug);


/* 0.*/
/* Program definitions */

  const fs = require('fs'),
	https = require('https'),
	io = require('socket.io')((SecureSocket)?false:WebSocketPort),
	ca = fs.readFileSync(__dirname + '/src/assets/certs/bundle.ca');
	if (SecureSocket) {
		server = https.createServer({
			key: fs.readFileSync(__dirname + '/src/assets/certs/priv.key'),
			cert: fs.readFileSync(__dirname + '/src/assets/certs/certificate.crt')
		});
		server.listen(WebSocketPort);
  		io.listen(server);
  	}

  const express = require('express'),
	spawn = require('child_process').spawn,
	args = require('minimist')(process.argv.slice(2)),
	app = express(); var build_running = false, ips = new Array();

	app.use(express.static(__dirname + '/dist/assets'));
	app.use('/', express.static(__dirname + '/dist'));

/* 1.*/

	/* Web Application */
	app.listen(WebPort, function() {
		console.log('Listening at: http://localhost:'+WebPort);
	});

	app.get('/', function(req, res) {
		res.send('<meta http-equiv="refresh" content="3; url=/"><p style="font-family: sans-serif;">Application Loading... <br/> <br/> [ <a href="/">Reload</a> ]</p>');
	});

	app.get('/candidates', function(req, res) {
		res.send( get_candidates() );
	});

	app.get('/statistics', function(req, res) {
		increments.statistics(poll, function(l, e) {
			res.send(e);
		});
	});
	
/* 2.*/

	/* Client Connection */
	io.on('connection', function( socket ) {

		if(Debug)console.log(socket.request.connection.remoteAddress + ' connected.');

		// Send the client the voting prompt & list of candidates.
		socket.on('candidates', function() {
			socket.emit('candidates', get_candidates() );
		});

		// Accept and process a vote.
		socket.on('vote', function (ballot) {
			if(!ballot || !ballot.key) return;
			var ip = socket.request.connection.remoteAddress;

			// Disallow voting if the IP address has already voted.
			if ( ips.indexOf(ip) == -1 || IPAddressProtection == false ) {

				// Add the vote to the database.
				increments.vote({ 'poll': poll, 'name': ballot.name, 'data': ip, 'instance': ballot.key });

				ips.push(ip); // Add the IP address to a list of used addresses.

				socket.emit('voted', ballot.candidate);
				socket.emit('reload',1);
				if(Debug)console.log(ip + ' voted.');

				increments.statistics(poll, function(e, stats) {
					io.emit('statistics', stats); // Send statistics to the user.
				});

			}
		});

		// Send the client the poll statistics.
		socket.on('statistics', function() {
			increments.statistics(poll, function(e, stats) {
				socket.emit('statistics', stats);
			});
		});

		// Send the client a nonce key.
		socket.on('nonce', function() {
			var ip = socket.request.connection.remoteAddress;
			if ( ips.indexOf(ip) == -1 || AllowRevoting == true ) {
				increments.getInstance(function (instance) {
					socket.emit('nonce', instance);
				});
			}
		});

	});

	function get_candidates(ip) {
		return {
			'poll': poll,
			'title': title,
			'prompt': prompt,
			'candidates': candidates,
			'voted': (ip&&ips.indexOf(ip)==-1) ? false : (IPAddressProtection),
			'debug': Debug,
			'show_statistics':AllowStatistics,
			'cookie_protection':CookieProtection,
			'source_available':AllowViewSource,
			'ip_address_protection':IPAddressProtection,
			'export_available':AllowDataExport,
			'allow_revoting': AllowRevoting
		}
	}

/* 3.*/

	/* Angular build & watch program. */

	function build(Watch=0,Turned=false) {
		if (build_running) return;
		if (Watch){
			fs.watch(__dirname+'/src', { recursive: true }, function(eventType, filename) {
				build(Watch,true);
			});
		}
		if ( args.render ) {
			build_running = true; var ng;
			if ( args.prod ) {
				if(Debug)console.log('Building Angular (production).');
				var arg1 = ['b', '--prod'];
				var arg2 = ['/s', '/c', 'ng', 'b', '--prod'];
			} else {
				var arg1 = ['b'];
				var arg2 = ['/s', '/c', 'ng', 'b'];
				if(Debug)console.log('Building Angular.');
			}
			if (!/^win/.test(process.platform)) {// inux
				ng = spawn('ng', arg1);
			} else {// windows
				ng = spawn('cmd', arg2);
			}
			ng.on('data', (data) => {
				if(Debug)console.log( `ng b: ${data}` );
			});
			ng.on('error', function(e) {
				if(Debug)console.log(e);
			});
			ng.on('close', (code) => {
				rb = false;
			});
		} else {
			/**
			* Build on Load:
			* For development purposes, run `ng b` to build Angular.
			**/
			ng = spawn('ng', ['b']);
			build_running = true;
			if(Watch&&Turned)console.log('Rebuilding...');
			if(Debug)console.log('Commencing Angular build process...');
			ng.on('data', (data) => {
				if(Debug)console.log( `ng b: ${data}` );
			});
			ng.on('error', function(e) {
				if(Debug)console.log(e);
			});
			ng.on('close', (code) => {
				if(Debug||!Debug)console.log(Date.now(),'A new build has been compiled.');
				build_running = false;
				io.emit('reload',1);
			});
		}
	}


	// Run the build
	if ( RunBuild ) build(true);


