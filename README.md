# Increment
Increment is a simple **database-driven web app** for placing **votes** for various political parties and candidiates. 
### Features
  - Localized or online browser-based voting mechanic
  - Unique session keys and cookie protection 
  - Database driven statistics page ([MongoDB](https://www.mongodb.com/))

![N|Solid](https://raw.githubusercontent.com/bentbot/increment/master/screenshots/vote.png)


### You can also:
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
$ npm install
$ node index.js
```
Endpoints:
- **Cast a vote:**  **[http://localhost:8000/](http://localhost:8000/)**
- **View voting results:** **[http://localhost:8000/statistics](http://localhost:8000/statistics)**

### Database
Modify the databse line in `./index.js` to **reflect your local or remote MongoDB** server. 
- The first segment is your database username and password: `mongodb://<username>:<password>`
- The second part is your database IP address and port: `@<address>:<port>`
- Finally, add the title of the collecton to the MongoDB URL: `/<collection name>`

`db.connect('mongodb://increment:inc@127.0.0.1:27017/increment');`


## Customization
### Modifying Candidates
The first few lines of `index.js` define the **candidates** and basic security settings. 

Candidates are encoded using the __JSON__ data standard. Make sure the structure remains intact and programmicly correct. Remember to omit the ending comma from the last candidate.

```sh
$ nano index.js

/* Define Canidates */
var candidates = [
    {name: "Kevin O'Leary", color: 'blue' },
    {name: 'Elizabeth May', color: 'green' },
    {name: 'Justin Trudeau', color: 'red'},
    {name: 'Tom Mulcair', color: 'orange'}
]
```
### Security
- Enable or disable **cookies** to prevent double voting:
    `var enableCookieProtection = false;`
- Enable or disable **browser instances** to prevent double voting:
    `var enableInstanceKeyProtection = true;`

## Testing
The _Increment_ package includes application to automatically test the voting procedure. Increment uses **Selenium Webdriver** to preform rapid-fire testing by __replicating how__ a user would cast a vote. 

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

* [ExpressJS] - HTTP service for web pages
* [Mongoose] - Mongo database driver
* [Crypto] - for unique key generation
* [node.js] - a self-contained webserver
* [jQuery] - frontend scripting
* [MongoDB] - local or remote database server
* [Webdriver] - automated browser testing

