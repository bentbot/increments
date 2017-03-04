const increment = require('../lib/increments');
increment.setup({ db: 'mongodb://increment:inc@localhost/increment' });
increment.poll('fruits', ['Apples','Bananas','Oranges','Pears']);
increment.vote('fruits', 'Oranges');
increment.statistics('fruits', function(e, f) { console.log( f.projectedWinner ); });