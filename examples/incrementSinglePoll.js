const increment = require('../lib/increments');

increment.setup({ db: 'mongodb://increment:inc@localhost:27017/increment' }, function (err) {
    if (err) throw (err);
    console.log('Connecting to Database: mongodb://increment:inc@localhost:27017/increment'); 
});

var election = 'elections';
const candidates = [
    { name: 'Donald Trump', color: 'red' }, 
    { name: 'Hillary Clinton', color: 'blue' }
];

increment.poll(election, candidates);

var args = process.argv.slice(2);

if (args[0]) {
    
    var ballot = { poll: election, name: args[0] };

    increment.vote(ballot, function(err, results) {
        if (err) throw (err);    
        
        increment.statistics(election, function(err, statistics) {
            if (statistics.total > 0) console.log('Leading Candidate: '+ statistics.projectedWinner.name);
            process.exit();
        });
        
    });

} else {
    console.log('Vote in the console: \n $ node ./incrementSinglePoll.js "Hillary Clinton"');
    process.exit();
}