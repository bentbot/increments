# Increment
Increment is a **database-driven** for creating  **polls** and taking **votes** for various options, candidates, or parties. Using MongoJS collections as a storage framework, Increments offers in-depth statistical data on generated polls.

## Usage
Install the **increments** module with NPM...
```sh
$ npm install increments
```
Add Increments to your code and specify a database. Increments can create polls with options, vote on polls, require unique keys & cookies, generate statistics, and calculate a winner.

```
    const increments = require('increments');
    increments.setup({ db: 'mongodb://increment:inc@localhost/increment' });
    increments.poll('fruits', ['Apples','Bananas','Oranges','Pears']);
    increments.vote('fruits', 'Oranges');
    increments.statistics('fruits', function(e, f) { console.log( f.projectedWinner ); });
```

### Features
  - Poll & voting mechanics
  - Database driven statistics ([MongoDB](https://www.mongodb.com/))
  - Unique session keys and cookie protection 

![N|Solid](https://raw.githubusercontent.com/bentbot/increment/master/screenshots/vote.png)


### You can also:
  - Create and interact with different polls
  - Add as many political parties as need
  - Test voting with an automated script
  - Log votes to a file
  - Turn cookies and session keys on or off
  - Submit or discard spoiled ballots

![N|Solid](https://raw.githubusercontent.com/bentbot/increment/master/screenshots/vote_canadian.png)

## Installation

Node.JS is required. Please install [Node.js](https://nodejs.org/) v4+ to run _Increment_ on your system.
Next, download or clone [the latest release](https://github.com/bentbot/increment) from GitHub. 
Use NPM to install the required dependences. **Warning: Dependences may not be secure and safe to use in a production environment.**
```sh
$ git clone https://github.com/bentbot/increment
$ cd ./increment 
$ npm install
$ node index.js
```
Endpoints:
- **Cast a vote:**  **[http://localhost:8000/](http://localhost:8000/)**
- **View voting results:** **[http://localhost:8000/statistics](http://localhost:8000/statistics)**

### Database
1. Create a user with the name `increment` which has `readWrite` access to a database.

2. Modify the databse line in `./increment.js` to **reflect your local or remote MongoDB** server. 
- The first segment is your database username and password: `mongodb://<username>:<password>`
- The second part is your database IP address and port: `@<address>:<port>`
- Finally, add the title of the collecton to the MongoDB URL: `/<collection name>`

```
increment.setup('mongodb://increment:<password>@localhost/increment');
```


### Modifying Candidates
The first few lines of `index.js` define the **candidates** and basic security settings. 

Candidates are encoded using the __JSON__ data standard. Make sure the structure remains intact and programmicly correct. Remember to omit the ending comma from the last candidate.

```sh

const candidates = [
    { name: 'Donald Trump', color: 'red' }, 
    { name: 'Hillary Clinton', color: 'blue' }
];

increment.poll('american', candidates);

```

### Voting
A vote can be formed in multiple ways. The most simple is to reference a poll and provide a name.
```
increment.vote('american', 'Donald Trump'); // Callback function optional
```
A vote may be passed as an object with the poll and name defined within it. 
```
var ballot = { poll: 'american', name: 'Donald Trump', data: '123' };

increment.vote(ballot, function(err, results) {
  console.log(results);
});

/* Output:
{ __v: 0,
  unique: '90699e28c94a02e1d67de02542132d036fa9f8f7dd655cd43668fdc8e1f28aff107b751d5292624ddc0bba8f3fc7278d',
  name: 'Donald Trump',
  poll: 'american',
  data: '123',
  _id: 58bb40f79477c58065acc950,
  time: 2017-03-04T22:34:31.929Z }
*/
```

### Statistics
Generating basic statistics can be accomplished by specifying the poll to count.
```
increment.statistics('american', function (err, statistics) {
  console.log(statistics);
});

/* Statistics Output: 
    { poll: 'american',
      candidates: 
        [ { name: 'Donald Trump',
            color: 'red',
            count: 1,
            id: 'donald_trump',
            percentage: '100.0' },
          { name: 'Hillary Clinton',
            color: 'blue',
            count: 0,
            id: 'hillary_clinton',
            percentage: 0 } ],
      total: 1,
      projectedWinner: 
        { name: 'Donald Trump',
          color: 'red',
          count: 1,
          id: 'donald_trump',
          percentage: '100.0' } 
    }
*/
```

### Security
Expremental security features are available.
- Enable or disable **cookies** to prevent double voting:
```
    var enableCookieProtection = false;
    // or
    increments.setup({ cookies: true, ... });
```
- Enable or disable **browser instances** to prevent double voting:
```
    var enableInstanceKeyProtection = true;
    // or 
    increments.setup({ instance: true, ... });
```

## Testing
The _Increment_ package includes application to automatically test the voting procedure. Increment uses **Selenium Webdriver** to preform rapid-fire testing by replicating how a user would cast a vote. 

### Setup WebDriver
The **webdriver-service** should only take only a moment to install. It can be installed to your system  with **NPM** or downloaded directly: http://www.seleniumhq.org/projects/webdriver/

`npm install webdriver-service -g`

### Incremental Testing
- Start the vote server so it is accessable from your web browser at http://localhost:8000/.
- In a new terminal window or _screen_, start the **webdriver-manager** by running: 

`$ webdriver-manager start`

In the terminal, if run the test.js file with the help argument you will see a list of options.
- -c  --candidate  1 		Select the candidate number by number
- -n  --numerations 100 		Set the number of votes
- -r  --random 			Choose a random candidate for each vote

`$ node test.js --help`

```ssh
$ node test.js -c 1 -n 65
Running 65 votes for candidate 1
```
If the test runs correctly, you should see a web browser pop-up and repeatedly cast a vote for the selected candidate. The results will are tabulated on the statistics page: http://localhost:8000/statistics 

## Screenshots
#### Statistics View (with one spoiled ballot)
![N|Solid](https://raw.githubusercontent.com/bentbot/increment/master/screenshots/statistics.png)

#### The error message seen when trying to vote again.
![N|Solid](https://raw.githubusercontent.com/bentbot/increment/master/screenshots/verification.png)

### Frameworks
Increment uses a number of open source projects to work properly:

* [Mongoose] - Mongo database driver
* [Crypto] - for unique key generation
* [node.js] - a self-contained webserver
* [ExpressJS] - HTTP service for web pages
* [jQuery] - frontend scripting
* [MongoDB] - local or remote database server
* [Webdriver] - automated browser testing