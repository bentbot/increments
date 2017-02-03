exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',

    capabilities: {
        'browserName': 'chrome'
    },

    specs: [
        './mainSpec.js'
    ],

    getPageTimeout: 10000,
	
    mochaOpts: {
  		reporter: "spec",
  		slow: 3000
    }
};
