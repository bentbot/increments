webpackJsonp(["main"],{

/***/ "./src/$$_gendir lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_gendir lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/***/ (function(module, exports) {

module.exports = "body {\n\tmin-height: 920px;\n\tmin-width: 325px;\n}"

/***/ }),

/***/ "./src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<!-- Increments Voting Software - check vote/vote.component.ts & run: node <proj dir>/index.js -->\n<vote></vote>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = (function () {
    function AppComponent() {
    }
    return AppComponent;
}());
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__("./src/app/app.component.html"),
        styles: [__webpack_require__("./src/app/app.component.css")]
    })
], AppComponent);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__("./node_modules/@angular/http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__vote_vote_component__ = __webpack_require__("./src/app/vote/vote.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ng_socket_io__ = __webpack_require__("./node_modules/ng-socket-io/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ng_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_ng_socket_io__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var config = {
    url: __WEBPACK_IMPORTED_MODULE_7__environments_environment__["a" /* environment */].socket,
    options: {
        rejectUnauthorized: false,
        secure: __WEBPACK_IMPORTED_MODULE_7__environments_environment__["a" /* environment */].secure_socket
    }
};
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_5__vote_vote_component__["a" /* VoteComponent */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_6_ng_socket_io__["SocketIoModule"].forRoot(config)
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "./src/app/vote/models.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Candidate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Statistics; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Ballot; });
var Candidate = (function () {
    function Candidate() {
    }
    return Candidate;
}());

var Statistics = (function () {
    function Statistics() {
    }
    return Statistics;
}());

var Ballot = (function () {
    function Ballot(poll, name, candidate, voted, instance, color, key) {
        this.poll = poll;
        this.name = name;
        this.candidate = candidate;
        this.voted = voted;
        this.instance = instance;
        this.color = color;
        this.key = key;
    }
    return Ballot;
}());

//# sourceMappingURL=models.js.map

/***/ }),

/***/ "./src/app/vote/vote.component.css":
/***/ (function(module, exports) {

module.exports = "section {\n\tmin-height: 100%;\n    margin: 0 0 -40px;\n}\n\np {\n\tpadding: 10px;\n\tfont-size: 22px;\n\tfont-family: 'Helvetica';\n\tmargin-top: 0;\n\tpadding-top: 40px;\n}\n\n.loading {\n\tfont-weight: bold;\n\tcolor: gray;\n\tfont-family: 'Helvetica';\n\tfont-size: 13px;\n\ttext-align:  center;\n\tmargin: 20px 0;\n}\n\n.candidates {\n\tlist-style: none;\n\tpadding: 0;\n\tmargin: 0;\n\ttext-align: center;\n\tmargin: 10px 0;\n}\n\n.candidate {\n\tbackground: #afafaf;\n\tdisplay: inline-block;\n\twidth: 125px;\n\theight: 125px;\n\tcolor: white;\n\tz-index: 10;\n\tfont-family: 'Helvetica';;\n\tfont-size: 21px;\n\ttext-align: center;\n\tpadding: 0px 5px 0 5px;\n\tmargin: 4px 24px 4px 4px;\n\tborder-width: 0px;\n\tcursor: pointer;\n\toutline: none;\n\toverflow: hidden;\n\tposition: relative;\n}\n\n.candidate div {\n\tvertical-align: middle;\n\tdisplay: table-cell;\n\theight: 130px;\n\twidth: 130px;\n\ttext-align: center;\n\t-webkit-user-select: none;\n\t   -moz-user-select: none;\n\t    -ms-user-select: none;\n\t        user-select: none;\n}\n\n.candidate:focus, \n.candidate.selected {\n\tmargin: 0px 20px 0px 0px;\n\tborder-style: solid;\n\tborder-width: 4px;\n\tbackground: white;\n\tcolor: black;\n}\n\n.candidate:hover {\n\n}\n\n.candidate:active, .button.voted {\n\tborder-color: white;\n}\n\n.results {\n\tmin-height: 360px;\n}\n\n.red { background: #F44336; border-color: #F44336; color: white; }\n\n.blue { background: #1565C0; border-color: #1565C0; color: white; }\n\n.orange { background: #ff9800; border-color: #ff9800; color: white; }\n\n.green { background: #4caf50; border-color: #4caf50; color: white; }\n\n.purple { background: rgb(94, 0 , 154); border-color: rgb(94, 0 , 154); color: white; }\n\n.skyblue { background: #4fc3f7; border-color: #4fc3f7; color: white; }\n\nh1.red, h2.red, h3.red { \n\tcolor: #F44336; \n\tbackground: transparent;     \n\tmargin: 5px 0;\n}\n\nh1.blue, h2.blue, h3.blue { \n\tcolor: #1565C0; \n\tbackground: transparent;     \n\tmargin: 5px 0;\n}\n\nh1.orange, h2.orange, h3.orange { \n\tcolor: #ff9800; \n\tbackground: transparent;     \n\tmargin: 5px 0;\n}\n\nh1.green, h2.green, h3.green { \n\tcolor: #4caf50; \n\tbackground: transparent;     \n\tmargin: 5px 0;\n}\n\nh1.purple, h2.purple, h3.purple { \n\tcolor: rgb(94, 0 , 154); \n\tbackground: transparent;     \n\tmargin: 5px 0;\n}\n\nh1.skyblue, h2.skyblue, h3.skyblue { \n\tcolor: #4fc3f7; \n\tbackground: transparent;     \n\tmargin: 5px 0;\n}\n\nh2.projectedVotes {\n\tmargin: 0;\n}\n\nh2.projectedWinner {\n\tmargin-top: 0px;\n\tpadding-top: 35px;\n}\n\nform {\n\ttext-align: center;\n}\n\ninput {\n\ttext-align: center;\n\tfont-size: 21px;\n}\n\n.button {\n\tposition: relative;\n\tz-index: 10;\n\tfont-size: 22px;\n\tpadding: 12px 35px 9px;\n\tcursor: pointer;\n\tbackground: white;\n\tborder: 1px solid #d6d6d6;\n\tborder-radius: 3px;\n\tmargin-top: 10px;\n\tfont-weight: bold;\n\ttext-transform: uppercase;\n\tborder-width: 4px;\n\toutline: none;\n\tfont-size: 17px;\n\tbackground: #ffd300;\n\tborder: 0px solid #ccc;\n\tborder-radius: 0px;\n\tmargin-top: 10px;\n\tpadding: 19px 40px 16px 40px;\n\tborder-bottom: 2px solid #f9bf00;\n}\n\n.button:focus {\n\tborder-color: #ffb200;\n}\n\n.button:hover {\n\tborder-color: #ffb200;\n}\n\n.button:active, .button.voted {\n\tbackground: white;\n\tborder-color: #ffd300;\n}\n\nh1 {\n\tmargin-top: 100px;\n\tfont-size: 40px;\n}\n\nul.statistics {\n    margin: 0;\n\tpadding: 0;\n    left: 0%;\n    z-index: 2;\n    width: 100%;\n    bottom: -5px;\n    position: fixed;\n    background: #f3f3f3;\n}\n\nul.statistics li {\n\tdisplay: inline-block;\n\tfont-family: 'Helvetica';;\n\tfont-size: 20px;\n\ttext-align: center;\n\twidth: 49%;\n\tpadding: 30px 0;\n\toverflow: hidden;\n\theight: 40px;\n\t-webkit-transition: all 0.2s linear;\n\ttransition: all 0.2s linear;\n}\n\nul.statistics li div {\n\tfont-size: 20px;\n}\n\n.error {\n\tbackground: #f9ff56;\n\twidth: 50%;\n\tmargin: 0 auto;\n\ttext-align: center;\n\tpadding: 15px;\n\tborder-radius: 0px;\n\tfont-family: 'Helvetica';;\n}\n\n.bottom {\n\tposition: relative;\n\tbottom: 0px;\n\tleft: 0px;\n\tright: 0px;\n\tz-index: 1;\n\tpadding: 10px;\n}\n\n.bottom.a {\n\tbottom: 110px;\n}\n\n.bottom a {\n\tmargin-right: 10px;\n\tborder: none;\n\tcolor: #707070;\n\tbackground:  transparent;\n\tfont-weight: bold;\n\ttext-decoration: none;\n\tpadding: 0% 3% 0% 3%; \n}\n\n.bottom a:hover {\n\ttext-decoration: underline;\n}\n\n@media screen and (max-height: 600px) {\n\t.vote {\n\t\tmargin-bottom: 70px;\n\t}\n}\n\n/* Copyright Liam Hogan - Published as bentbot in 2020 */"

/***/ }),

/***/ "./src/app/vote/vote.component.html":
/***/ (function(module, exports) {

module.exports = "<section>\n\t<div class=\"loading\" *ngIf=\"!loaded\">Connecting to server...</div>\n\t<div *ngIf=\"loaded\">\n\t\t<div class=\"vote\" *ngIf=\"!voted && show_buttons\">\n\t\t\t<p>{{prompt}}</p>\n\t\t\t<h2>{{pollTitle}}</h2>\n\t\t\t<ul class=\"candidates\">\n\t\t\t\t<li *ngFor=\"let candidate of candidates; let i = index;\" \n\t\t\t\t\t[attr.tabindex]=\"i\" \n\t\t\t\t\t[attr.class]=\"(ballot.candidate==candidate.id)?'selected candidate '+candidate.color:'candidate '+candidate.color\" \n\t\t\t\t\t(click)=\"select_vote(candidate);\" (keyup)=\"kb($event,candidate)\">\n\t\t\t\t\t\t<div>{{ candidate.name }}</div>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t\t<form action=\"/vote\" method=\"post\">\n\t\t\t\t<input class=\"vote\" type=\"hidden\" [(ngModel)]=\"ballot.candidate\" id=\"vote\" name=\"vote\" /> \n\t\t\t\t<input class=\"signature\" type=\"hidden\" [(ngModel)]=\"ballot.instance\" name=\"instance\" />\n\t\t\t\t<br/>\n\t\t\t\t<input \t(click)=\"vote(ballot)\" \n\t\t\t\t\t[attr.title]=\"ballot?'Cast a ballot for: '+ballot.name:''\" \n\t\t\t\t\t[attr.class]=\"(ballot.voted?'voted button ':'button ')+ballot.color\" \n\t\t\t\t\ttype=\"submit\" id=\"submit\" value=\"Cast Your Vote\"/>\n\t\t\t</form>\n\t\t</div>\n\t\t<div *ngIf=\"voted && show_buttons\">\n\t\t\t<p> <b>Thank you.</b> You have voted in the: </p>\n\t\t\t<h2>{{pollTitle}}</h2>\n\t\t\t<ul class=\"candidates\">\n\t\t\t\t<li *ngFor=\"let candidate of candidates; let i = index;\" \n\t\t\t\t\t[attr.class]=\"(voted==candidate.id)?'selected candidate '+candidate.color:'candidate '+candidate.color\">\n\t\t\t\t\t\t<div>{{ candidate.name }}</div>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t\t<div *ngIf=\"statistics && allow_statistics\">\n\t\t\t<div *ngIf=\"statistics.total == 0 && (!show_buttons||voted)\"><h2>No Statistics</h2></div>\n\t\t\t<div class=\"results\" *ngIf=\"statistics.total >  0 && (!show_buttons||voted)\" >\n\t\t\t\t<h2 class=\"projectedWinner\">Projected Winner:</h2>\n\t\t\t\t<h1 [attr.class]=\"statistics.projectedWinner.color\">\n\t\t\t\t\t{{statistics.projectedWinner.name}}\n\t\t\t\t</h1>\n\t\t\t\t<p>Votes: {{statistics.projectedWinner.count}} ({{statistics.projectedWinner.percentage}}%)</p>\n\t\t\t</div>\n\t\t\t<ul class=\"statistics\">\n\t\t\t\t<li *ngFor=\"let candidate of statistics.candidates\" \n\t\t\t\t\ttitle=\"{{candidate.name}}: {{candidate.count}} {{candidate.count==1?'Vote':'Votes'}} ({{candidate.percentage}}%)\"\n\t\t\t\t\t[attr.id]=\"candidate.id\" \n\t\t\t\t\t[attr.class]=\"candidate.color\" \n\t\t\t\t\t[style.width.%]=\"candidate.percentage\" \n\t\t\t\t\t[attr.data-count]=\"candidate.count\">\n\t\t\t\t\t<div class=\"name\">{{ candidate.name }}</div>\n\t\t\t\t\t<div class=\"count\">{{ candidate.count }}</div>\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t</div>\n\t</div>\n\t<div class=\"push\"></div>\n</section>\n\n<div class=\"footer\">\n\t<div [attr.class]=\"(statistics&&allow_statistics)?'bottom a':'bottom'\">\n\t\t<a *ngIf=\"view_source\" href=\"https://github.com/bentbot/Canada-Votes-2019\" title=\"GitHub\" aria-label=\"This application available for free on GitHub.\" class=\"button\">\n\t\t\t<span>Source</span>\n\t\t</a>\n\t\t<a *ngIf=\"!show_buttons && allow_revote\" href=\"#vote\" class=\"button\" title=\"Re-Vote\" aria-label=\"Go to the voting screen.\" (click)=\"voting_screen();\">\n\t\t\t<span>Voting Screen</span>\n\t\t</a>\n\t\t<a *ngIf=\"allow_revote && voted && show_buttons\" href=\"#vote\" title=\"Re-Vote\" aria-label=\"Vote in this poll again.\" class=\"button\" (click)=\"voting_screen();\">\n\t\t\t<span>Vote Again</span>\n\t\t</a>\n\t\t<a *ngIf=\"allow_statistics && show_buttons\" href=\"#statistics\" title=\"View Poll Statistics\" aria-label=\"Go to this poll's statistics.\" class=\"button\" (click)=\"show_statistics();\">\n\t\t\t<span>Statistics</span>\n\t\t</a>\n\t\t<a *ngIf=\"export_data\" href=\"/statistics\" title=\"Export JSON Data\" aria-label=\"Export statistics.\" class=\"button\">\n\t\t\t<span>JSON</span>\n\t\t</a>\n\t</div>\n</div>"

/***/ }),

/***/ "./src/app/vote/vote.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VoteComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng_socket_io__ = __webpack_require__("./node_modules/ng-socket-io/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng_socket_io___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ng_socket_io__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_cookies__ = __webpack_require__("./node_modules/ng2-cookies/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ng2_cookies___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_ng2_cookies__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models__ = __webpack_require__("./src/app/vote/models.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var VoteComponent = (function () {
    function VoteComponent(socket, title, cookie) {
        this.socket = socket;
        this.title = title;
        this.cookie = cookie;
        this.debug = 1;
        this.pollTitle = '';
        this.prompt = '';
        this.ballot = new __WEBPACK_IMPORTED_MODULE_4__models__["a" /* Ballot */]();
    }
    /**
     * Nonce Key
    **/
    VoteComponent.prototype.nonce = function () {
        var _this = this;
        this.socket.emit("nonce", 1);
        this.socket.fromEvent("nonce")
            .subscribe(function (result) {
            _this.ballot.key = result;
        });
    };
    /**
     * Vote ( selecting an option )
    **/
    VoteComponent.prototype.select_vote = function (candidate) {
        this.ballot.name = candidate.name;
        this.ballot.candidate = candidate.id;
    };
    /**
     * Voting ( processing a vote )
    **/
    VoteComponent.prototype.vote = function (ballot) {
        var _this = this;
        if (!this.voted && ballot.candidate) {
            this.socket.emit("vote", ballot);
            this.socket.fromEvent("voted")
                .subscribe(function (result) {
                _this.voted = result;
                ballot.voted = true;
                if (_this.cookie_protection)
                    _this.cookie.set('voted', ballot.candidate);
                if (_this.allow_statistics)
                    _this.get_statistics();
            });
        }
    };
    /**
     * Candidates ( processing a vote )
    **/
    VoteComponent.prototype.get_candidates = function () {
        var _this = this;
        this.socket.emit("candidates", true);
        return this.socket
            .fromEvent("candidates")
            .subscribe(function (result) {
            // Poll Data
            _this.candidates = result.candidates;
            _this.ballot.poll = result.poll;
            _this.prompt = result.prompt;
            _this.pollTitle = result.title;
            _this.voted = result.voted;
            // Application Options
            _this.debug = (!_this.debug) ? result.debug : _this.debug;
            _this.allow_statistics = result.show_statistics;
            _this.view_source = result.source_available;
            _this.export_data = result.export_available;
            _this.cookie_protection = result.cookie_protection;
            _this.ip_addr_protection = result.ip_address_protection;
            if (!_this.ip_addr_protection)
                if (!_this.cookie_protection)
                    _this.allow_revote = result.allow_revoting;
            // Get browser's cookie to see if they have already voted.
            if (_this.cookie_protection)
                _this.get_voted_cookie();
            if (_this.allow_statistics && window.location.hash == "#statistics") {
                _this.show_buttons = false;
            }
            else {
                _this.show_buttons = true;
            }
            _this.title.setTitle(_this.pollTitle);
            if (_this.debug)
                console.log(result);
            _this.loaded = true;
        });
    };
    /**
     * Statistics & Results
    **/
    VoteComponent.prototype.get_statistics = function () {
        var _this = this;
        if (this.allow_statistics) {
            this.socket.emit("statistics", true);
            this.socket.fromEvent("statistics").subscribe(function (result) {
                _this.statistics = result;
                if (_this.debug)
                    console.log(result);
            });
        }
    };
    VoteComponent.prototype.show_statistics = function () {
        this.get_statistics();
        this.show_buttons = false;
        window.scrollTo(0, 0);
    };
    /**
     * Keyboard Events
    **/
    VoteComponent.prototype.kb = function (e, c) {
        if (e.keyCode == 13 || e.keyCode == 32) {
            this.select_vote(c);
        }
    };
    /**
     * Browser Cookie Checking
    **/
    VoteComponent.prototype.get_voted_cookie = function () {
        if (this.cookie.get('voted') != '') {
            this.voted = this.cookie.get('voted');
            if (this.allow_statistics)
                this.get_statistics();
        }
        else {
            this.voted = null;
        }
    };
    /**
     * Vote Again
    **/
    VoteComponent.prototype.voting_screen = function () {
        if (this.allow_revote) {
            this.nonce();
            this.voted = null;
            window.scrollTo(0, 0);
            this.statistics = null;
            this.show_buttons = true;
            this.ballot = new __WEBPACK_IMPORTED_MODULE_4__models__["a" /* Ballot */]();
        }
    };
    /**
     * AngularInit
    **/
    VoteComponent.prototype.ngOnInit = function () {
        this.voted = null;
        this.nonce();
        /**
         * Get the list of Candidates from the Node.js socket server.
        **/
        this.get_candidates();
        /**
         *
         * Install & run `index.js` with:
         * $ cd <proj. dir>; npm install;
         * $ node <proj. dir>/index.js
         *  or:
         * $ nodemon <proj. dir>/index.js
         *
        **/
        // Comment this out to disable automatic reloading (useful in dev.)
        this.socket.fromEvent("reload").subscribe(function () { location.reload; });
    };
    return VoteComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__models__["b" /* Candidate */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__models__["b" /* Candidate */]) === "function" && _a || Object)
], VoteComponent.prototype, "candidates", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__models__["c" /* Statistics */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__models__["c" /* Statistics */]) === "function" && _b || Object)
], VoteComponent.prototype, "statistics", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
    __metadata("design:type", String)
], VoteComponent.prototype, "pollTitle", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
    __metadata("design:type", String)
], VoteComponent.prototype, "prompt", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
    __metadata("design:type", Boolean)
], VoteComponent.prototype, "view_source", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
    __metadata("design:type", Boolean)
], VoteComponent.prototype, "export_data", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
    __metadata("design:type", Boolean)
], VoteComponent.prototype, "allow_statistics", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
    __metadata("design:type", Boolean)
], VoteComponent.prototype, "cookie_protection", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
    __metadata("design:type", Boolean)
], VoteComponent.prototype, "ip_addr_protection", void 0);
VoteComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'vote',
        providers: [__WEBPACK_IMPORTED_MODULE_3_ng2_cookies__["CookieService"]],
        template: __webpack_require__("./src/app/vote/vote.component.html"),
        styles: [__webpack_require__("./src/app/vote/vote.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2_ng_socket_io__["Socket"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_ng_socket_io__["Socket"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["b" /* Title */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["b" /* Title */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_3_ng2_cookies__["CookieService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3_ng2_cookies__["CookieService"]) === "function" && _e || Object])
], VoteComponent);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=vote.component.js.map

/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
/**
 * Front-end Variables
 * Mode: local development
**/
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false,
    socket: 'http://localhost:3300',
    secure_socket: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_20" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map