const increment = require('../lib/increments');
const async = require('../node_modules/async');


// Change the database username, password, ip, port, and collection
increment.setup('mongodb://increment:inc@localhost:27017/increment', function (err) {
    if (err) throw (err);
    console.log('Connecting to Database: mongodb://increment:inc@localhost:27017/increment'); 
});


// Set up two parallel polls
increment.poll('american', [{ name: 'Donald Trump', color: 'red' }, { name: 'Hillary Clinton', color: 'blue' }]);
increment.poll('canadian', [{ name: 'Conservatives', color: 'blue' }, { name: 'Liberals', color: 'red' }]);


async.parallel([
    function(statistics) {
        increment.vote({poll: 'american', name: 'Donald Trump'}, function(err, results) {
            console.log('Voted: ' + results.name);
            statistics(err, 'american');
        });
    }, function (statistics) {
        increment.vote({poll: 'canadian', name: 'Liberals'}, function(err, results) {
            if (err) throw (err);
            console.log('Voted: ' + results.name);
            statistics(err, 'canadian');
        });
    }
], function (err, polls) {
        if (err) throw (err);
        increment.statistics(polls, function(err, data) {
            if (err) throw (err);
            console.log(data);
        }); 
    }
);