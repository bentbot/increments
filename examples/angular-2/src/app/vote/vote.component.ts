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

  constructor(private socket: Socket,
  			  private cookie: CookieService) { 
		this.voted = (this.cookie.get('voted') != '') ? true : false;
	}
  	
  	key: string;
  	statistics: any;
  	voted: boolean;
  	ballot = new Ballot('', this.key);
  	

    vote() {
    	if ( !this.voted ) {
    		this.socket.emit("vote", this.ballot);
	        this.cookie.set('voted', this.ballot.candidate);
	        this.getStats();
    	}
    }

    getStats() {
    	this.socket.emit("statistics", true);
        return this.socket
            .fromEvent<any>("statistics")
           .subscribe((result) => { this.statistics = result });
    }

	ngOnInit() {
		this.ballot.candidate = this.cookie.get('voted');
		if (this.voted) this.getStats();
	}


}

export class Ballot {
	constructor(
		public candidate: string,
		public key: string
	) { }
}