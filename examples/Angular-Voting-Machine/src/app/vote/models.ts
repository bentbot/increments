export class Candidate {
	id: string;
	name: string;
	count: number;
	percentage: any;
	image: any;
	data: any;
	color: string;
}

export class Statistics {
	poll: string;
	total: number;
	candidates: Candidate;
	projectedWinner: Candidate;
}

export class Ballot {
	constructor(
		public poll?: string,
		public name?: string,
		public candidate?: string,
		public voted?: boolean,
		public instance?: string,
		public color?: string,
		public key?: string
	) { }
}