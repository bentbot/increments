// Set Defaults
var selectedCandidate = 1;
var numerations = 1;

// Get Console Args
var chalk = require('chalk');
if (process.argv[2] && process.argv[3]) {
	selectedCandidate = process.argv[2];
	numerations = process.argv[3];
	console.log(chalk.green.bold('Running '+numerations+' votes for candidate '+selectedCandidate))
} else {
	console.log(chalk.green.bold('Specify the candidate and amount of votes to run test.'))
	console.log(chalk.bold('node test.js [Candidate example: 1] [Iterations example: 100]'))
}

// Gather requirements
var async = require('async');
var webdriver = require('selenium-webdriver'),
	By = webdriver.By,
    until = webdriver.until;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
	chai.use(chaiAsPromised);
var expect = chai.expect;

// Start the webdriver
var driver = new webdriver.Builder()
	.forBrowser('chrome')
	.usingServer('http://localhost:4444/wd/hub')
	.build();



// Begin the voting loop
for (var i = numerations - 1; i >= 0; i--) {

	// Load the front-end
	driver.get('http://localhost:8000');

	// Select a candidate 
	var candidates = driver.findElement(By.css('.candidates li:nth-child('+selectedCandidate+')')).click()

	// Submit the vote
	driver.findElement(By.id('submit')).click();

	// Load the statistics
	driver.get('http://localhost:8000/statistics');


};

// Quit the driver, end the test
driver.quit();