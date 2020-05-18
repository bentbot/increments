import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from '../../environment';
import { Socket } from 'ng-socket-io';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'vote',
  providers: [CookieService],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})

export class VoteComponent implements OnInit {

	constructor(	private socket: Socket,
			private cookie: CookieService) 
	{
		// Get the browser cookie (if set)...
		this.voted = (this.cookie.get('voted') != '') ? true : false;
	}

	key: string;
	voted: boolean;

	prompt: string;
	poll: string;
	candidates: any;
	statistics: any;

	ballot = new Ballot('', this.key);

	vote() 
	{
		if ( !this.voted ) 
		{
			this.socket.emit("vote", this.ballot);			// Send the vote data.
			this.cookie.set('voted', this.ballot.candidate);	// Add a browser cookie.
			this.getStats();					// Request the results.
		}
	}

        /* Update the results & statistics: */
        getCandidates() 
	{
                this.socket.emit("candidates", true);
                 return this.socket
                        .fromEvent<any>("candidates")
                        .subscribe((result) => {
				this.poll = result.poll;
				this.prompt = result.prompt;
                                this.candidates = result.candidates;
                        });
        }

	/* Update the results & statistics: */
	getStats() 
	{
		this.socket.emit("statistics", true);
		 return this.socket
			.fromEvent<any>("statistics")
			.subscribe((result) => { 
				this.statistics = result 
			});
	}

	/* Runs on page-load: */
	ngOnInit() 
	{
		this.ballot.candidate = this.cookie.get('voted');
		if (this.voted) this.getStats();
	}

}

export class Ballot 
{
	constructor(
		public candidate: string,
		public key: string
	) { }
}


