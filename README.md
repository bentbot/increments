# Increment
Increment is a simple database-driven web app for casting and counting votes for different political parties and candidiates. 
### Features
  - Localized or online browser-based voting mechanic
  - Unique session keys and cookie protection 
  - Database driven statistics page

![N|Solid](https://raw.githubusercontent.com/bentbot/increment/master/screenshots/vote.png)


### You can also:
  - Add as many political parties as need
  - Log votes to a file
  - Turn cookies and session keys on or off
  - Submit or discard spoiled ballots

![N|Solid](https://raw.githubusercontent.com/bentbot/increment/master/screenshots/vote_canadian.png)


### Frameworks

Increment uses a number of open source projects to work properly:

* [ExpressJS] - HTTP service for web pages
* [Mongoose] - Mongo database driver
* [Crypto] - for unique key generation
* [node.js] - a self-contained webserver
* [jQuery] - frontend scripting
* [MongoDB] - local or remote database server

### Installation

Node.JS is required. Please install [Node.js](https://nodejs.org/) v4+ to run.

Download or clone [the latest release](https://github.com/bentbot/increment).

Modify the databse line in `./index.js` to reflect your local or remote server:
`db.connect('mongodb://increment:inc@127.0.0.1:27017/increment');`

Install the dependencies and and start the server.

```sh
$ npm install
$ node index
```

### Customization
Take a look at the `index.js` file. The first few lines of the document define the  candidates and basic security settings. 
- `enableInstanceKeyProtection` = 'true' prevents duplicate post exploits
- `enableCookieProtection` = 'true' prevents the same browser from re-voting
```sh
$ nano index.js

/* Define Canidates */
var candidates = [
    {name: "Kevin O'Leary", color: 'blue' },
    {name: 'Elizabeth May', color: 'green' },
    {name: 'Justin Trudeau', color: 'red'},
    {name: 'Tom Mulcair', color: 'orange'}
]

/* Protection */

// Cookies allow a web browser to cast only one ballot.
// Keep in mind that cookies can be spoofed or cleared which can lead to false votes.
var enableCookieProtection = false;

// Add a hidden key to each browser instance ignore double-posts
var enableInstanceKeyProtection = true;
```
### Screenshots
#### Statistics View (with one spoiled ballot)
![N|Solid](https://raw.githubusercontent.com/bentbot/increment/master/screenshots/statistics.png)

#### The error message seen when trying to vote again.
![N|Solid](https://raw.githubusercontent.com/bentbot/increment/master/screenshots/verification.png)
