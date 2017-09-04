const io = require('socket.io')(3300),
	fs = require('fs'),
	express = require('express'),
	increments = require('increments'),
	spawn = require('child_process').spawn;

var	rebuilding = false,
	usersOnline = 0,
	ips = new Array();

	var app = express();
	app.use(express.static(__dirname + '/dist/assets'));
	app.use('/', express.static(__dirname + '/dist'));


	app.listen(8080, function() {
        	build();
	        console.log('Listening on 8080');
	});

	app.get('/', function(req, res) {
		res.send('<a href="/" style="font-family: sans-serif;">Loading...</a>');
	});

	fs.watch(__dirname+'/src', { recursive: true }, function(eventType, filename) {
		console.log('Rebuild')
		build();
	});

	increments.setup({ db: 'mongodb://legalize:weed@localhost/legalize' });
	increments.poll('legalize', ['Yes','No']);

	io.on('connection', function( socket ) {

		usersOnline = usersOnline+1;
		console.log(socket.request.connection.remoteAddress + ' connected. '+usersOnline+' users online.');

		socket.on('vote', function (ballot) {
			var ip = socket.request.connection.remoteAddress;
			console.log(ip + ' voted: ' + ballot);
			if ( ips.indexOf(ip) == -1 ) {
				increments.vote({ poll: 'legalize', name: ballot.candidate, data: ip });
				ips.push(ip);
			}
		});


		socket.on('statistics', function() {
			increments.statistics('legalize', function(e, f) {
				socket.emit('statistics', f);
			});
		});

		socket.on('disconnect', function() {
			usersOnline = usersOnline-1;
		});
		
	});


	function build(a) {

		if (rebuilding) return;

		rebuilding = true;

		let c = a ? a : 'b';

		ng = spawn('ng', [c])

	        ng.stdout.on('data', (data) => {
	            console.log(`stdout: ${data}`);
	        });

	        ng.stderr.on('data', (data) => {
	            console.log( `ng b: ${data}` );
        	});

	        ng.on('error', function(e) {
            	console.log(e);
        	})

        	ng.on('close', (code) => {
				rebuilding = false;
			});
	}
