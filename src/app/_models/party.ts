export class Party {
	id: number;
	partyName: string;
	contact: string;
	isActive: boolean;
}

export class PartyRes extends Party {
  success:string;
  data?:Party[];
  msg?:string ;
  message?:string;
  err?:any;
}
