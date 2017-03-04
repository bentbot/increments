// Set Defaults
var selectedCandidate = false;
var numerations = 1;
var randomCandidate = false;
var url= 'http://localhost:8000';
// Get Console Args
var chalk = require('chalk');

for( i = 0; i <= process.argv.length-1; i++) { 
	
	switch ( process.argv[i] ){
		case '--candidate':
		case '-c':
			selectedCandidate = process.argv[i+1];
		break;
		case '--numerations':
		case '-n':
			numerations = process.argv[i+1];
		break;
		case '--random':
		case '-rand':
		case '-r':
			randomCandidate = true;
		break;
		case '-url':
			url = process.argv[i+1];
		break;
		case '--help':
		case '-h':
			showHelp();
			process.exit();
		break;
	}
}

// default:
// console.log(chalk.green.bold('Specify the candidate and amount of votes to run test.'));
// console.log(chalk.bold('node test.js --candidate 1 --numerations 100'));
// break;
 

// Gather requirements
var async = require('async');
var webdriver = require('selenium-webdriver'),
	By = webdriver.By,
	size = webdriver.size,
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
	driver.get(url);

	// Select a random candidate if needed
	if (randomCandidate) {
		driver.findElements(webdriver.By.css('.candidates li')).then(function(candidates){
			// Select a random candidate
			selectedCandidate = Math.floor((Math.random() * candidates.length) + 1);
		
			// Select a candidate 
			var candidates = driver.findElement(By.css('.candidates li:nth-child('+selectedCandidate+')')).click()

			// Submit the vote
			driver.findElement(By.id('submit')).click();
		});

	// Or select the candidate in the command line argument
	} else if (selectedCandidate) {
		// Select a candidate 
		var candidates = driver.findElement(By.css('.candidates li:nth-child('+selectedCandidate+')')).click()

		// Submit the vote
		driver.findElement(By.id('submit')).click();

	// Show help text
	} else {
		showHelp();
	}

	

	// Load the statistics
	driver.get(url+'/statistics');


};

// Quit the driver, end the test
driver.quit();



function showHelp() {
	console.log('Welcome to...');
	console.log(chalk.bold('\n┬┌┐┌┌─┐┬─┐┌─┐┌┬┐┌─┐┌┐┌┌┬┐\n│││││  ├┬┘├┤ │││├┤ │││ │ \n┴┘└┘└─┘┴└─└─┘┴ ┴└─┘┘└┘ ┴ \n				'));
	console.log(chalk.bold('You can add any of these command arguments to change the results of the test.'));
	console.log('-c  --candidate  1 		Select the candidate number by number');
	console.log('-n  --numerations 100 		Set the number of votes');
	console.log('-r  --random 			Choose a random candidate for each vote');
	console.log('-url 				The URL of the vote server (default: http://localhost:8000)');
	console.log('\nExample Commands:');
	console.log(chalk.bold('node test.js --candidate 1 --numerations 100'));
	console.log(chalk.bold('node test.js -c 1 -n 50'));
	console.log(chalk.bold('node test.js --random -n 1000 \n'));
}
