const increments = require('../lib/increments');
increments.setup({ db: 'mongodb://increment:inc@localhost/increment' });
increments.poll('fruits', ['Apples','Bananas','Oranges','Pears']);
increments.vote('fruits', 'Apples');
increments.vote('fruits', 'Oranges');
increments.statistics('fruits', function(e, data) { console.log( data ); });