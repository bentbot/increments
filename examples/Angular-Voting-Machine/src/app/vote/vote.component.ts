import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { Socket } from 'ng-socket-io';
import { CookieService } from 'ng2-cookies';
import { Candidate, Statistics, Ballot } from './models';

@Component({
  selector: 'vote',
  providers: [CookieService],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})

export class VoteComponent implements OnInit {

	debug = 1;

	@Input() candidates: Candidate;
	@Input() statistics: Statistics;

	@Input() pollTitle:string = '';
	@Input() prompt:string = '';

	@Input() view_source: boolean;
	@Input() export_data: boolean;
	@Input() allow_statistics: boolean;
	@Input() cookie_protection: boolean;
	@Input() ip_addr_protection: boolean;

	key: string;
	voted: string;
	loaded: boolean;
	allow_revote: boolean;
	show_buttons: boolean;
	ballot = new Ballot();

	constructor(private socket: Socket,
				private title: Title,
				private cookie: CookieService) 
	{ 
		
	}

	/** 
	 * Nonce Key
	**/
	nonce() {
		this.socket.emit("nonce", 1);
		this.socket.fromEvent<any>("nonce")
			.subscribe((result) => {
				this.ballot.key = result;
			});
	}

	/** 
	 * Vote ( selecting an option ) 
	**/
	select_vote(candidate) {
		this.ballot.name = candidate.name; 
		this.ballot.candidate = candidate.id;
	}

	/** 
	 * Voting ( processing a vote ) 
	**/
	vote(ballot) {
		if ( !this.voted && ballot.candidate ) {
			this.socket.emit("vote", ballot);
			this.socket.fromEvent<any>("voted")
				.subscribe((result) => {
					this.voted = result;
					ballot.voted = true;
					if (this.cookie_protection)  this.cookie.set('voted', ballot.candidate);
					if (this.allow_statistics)   this.get_statistics();
				});
		}
	}

	/** 
	 * Candidates ( processing a vote ) 
	**/
	get_candidates() {
		this.socket.emit("candidates", true);
		return this.socket
			.fromEvent<any>("candidates")
			.subscribe((result) => { 

				// Poll Data
				this.candidates 		= result.candidates;
				this.ballot.poll 		= result.poll;
				this.prompt 			= result.prompt;
				this.pollTitle 			= result.title;
				this.voted 				= result.voted;
				
				// Application Options
				this.debug 				= (!this.debug)?result.debug:this.debug;
				this.allow_statistics 	= result.show_statistics;
				this.view_source		= result.source_available;
				this.export_data		= result.export_available;
				this.cookie_protection 	= result.cookie_protection;
				this.ip_addr_protection = result.ip_address_protection;
				if(!this.ip_addr_protection) if(!this.cookie_protection)
					this.allow_revote 	= result.allow_revoting;

				// Get browser's cookie to see if they have already voted.
				if(this.cookie_protection) this.get_voted_cookie();
				if (this.allow_statistics && window.location.hash == "#statistics") {
					this.show_buttons = false;
				} else { 
					this.show_buttons = true; 
				}

				this.title.setTitle( this.pollTitle );
				if (this.debug) console.log(result);
				this.loaded = true;

			});
	}

	/** 
	 * Statistics & Results
	**/
	get_statistics() {
		if (this.allow_statistics) {
			this.socket.emit("statistics", true);
			this.socket.fromEvent<any>("statistics").subscribe((result) => {
				this.statistics = result;
				if(this.debug) console.log(result);
			});
		}
	}

	show_statistics() {
		this.get_statistics();
		this.show_buttons=false;
		window.scrollTo(0,0);
	}

	/** 
	 * Keyboard Events
	**/
	kb(e, c) { 
		if ( e.keyCode == 13 || e.keyCode == 32 ) {
			this.select_vote(c); 
		}
	}

	/** 
	 * Browser Cookie Checking
	**/
	get_voted_cookie() {
		if (this.cookie.get('voted') != '') {
			this.voted = this.cookie.get('voted');
			if (this.allow_statistics) this.get_statistics();
		} else {
			this.voted = null;
		}
	}

	/** 
	 * Vote Again
	**/
	voting_screen() {
		if ( this.allow_revote ) {
			this.nonce();
			this.voted = null;
			window.scrollTo(0,0);
			this.statistics = null;
			this.show_buttons = true;
			this.ballot = new Ballot();
		}
	}

	/** 
	 * AngularInit
	**/
	ngOnInit() {

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
		this.socket.fromEvent<any>("reload").subscribe(()=>{location.reload});

	}
}