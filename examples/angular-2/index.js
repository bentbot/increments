  const io = require('socket.io')(3300),
	express = require('express'),
	increments = require('../../lib/increments');

  const app = express(),ARGS = process.argv.slice(2);
	app.use(express.static(__dirname + '/dist/assets'));
	app.use('/', express.static(__dirname + '/dist'));



	/* Name the poll */
	const poll = 'mock_election';

	/* Define your canidates */
	const prompt = 'Please choose a side:';
	const candidates = [
		{ name: 'Yes', color: 'red' },
		{ name: 'No', color: 'blue' }
	];

	/* Increments poll setup & MYSQL Database authorization details. */
	increments.setup('mysql://sql_username:password@localhost:3306/mock_election');
	increments.poll( poll, candidates );



	/* No need to edit code below this line. */

	const ips = new Array();
	// Socket.IO data transfer.
	io.on('connection', function( socket ) {

                socket.on('candidates', function() {
                        socket.emit('candidates', {
				poll: poll,
                                prompt: prompt,
                                candidates: candidates
                        });
                });

		socket.on('vote', function (ballot) {
			var ip = socket.request.connection.remoteAddress;
			console.log(ip + ' voted in poll '+poll+': ' + ballot);
			if ( ips.indexOf(ip) == -1 ) {
				increments.vote({
					poll: poll,
					name: ballot.candidate,
					data: ip
				});
				ips.push(ip);
			}
		});

		socket.on('statistics', function(p = poll) {
			increments.statistics( p, function(e, stats) {
				socket.emit('statistics', stats);
			});
		});

	});

        // Start the webserver.
        app.listen(8080, function() {
                if (ARGS[0]=='--dev'||ARGS[0]=='d'||ARGS[0]=='s'||ARGS[0]=='--serve') build();
                console.log('Listening on http://127.0.0.1:'+8080);
        });

	// Serve the voting page. Located at: http://localhost:8080/
        app.get('/', function(req, res) {
                res.send('<a href="/" style="font-family: sans-serif;">Loading...</a>');
        });


// Angualr Dev Env.
if (ARGS[0]=='--build'||ARGS[0]=='b'||ARGS[0]=='s'||ARGS[0]=='--serve'){
  const spawn = require('child_process').spawn,
	fs = require('fs'); var rb = false;

        // Watch the Angualr source code and automatically rebuild the app.
        fs.watch(__dirname+'/src', { recursive: true }, function(eventType, filename) {
                console.log('Rebuilding...');
                build();
        });

	// Angular6 build function
	function build(a) {
		if (rb) return;
		rb = true;
		let c = a ? a : 'b';
		// 'ng' command-line arg
		ng = spawn('ng', [c]);
	        ng.stdout.on('data', (data) => {
	            console.log(`stdout: ${data}`);
	        });
	        ng.stderr.on('data', (data) => {
	            console.log( `ng b: ${data}` );
        	});
	        ng.on('error', function(e) {
	            	console.log(e);
        	});
        	ng.on('close', (code) => {
			rebuilding = false;
		});
	}
}
