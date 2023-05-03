import { Party } from "./party";
export class Denomination{
  rs2000:number;
  rs500:number;
  rs200:number;
  rs100:number;
  rs50:number;
  rs20:number;
  rs10: number;
  coins: number;
}
export class Transaction {
  id?:number;
  _id?:number;
  date: Date;
  account?: string;
  name ?:string;
  narration?:string;
  amount :number ;
  denomination?: Denomination;
  isApproved?:boolean;
  approvedOn?:Date;
  paymentType: string;
  transactionBy:string;
}


export class TransactionRes extends Transaction {
  success:string;
  data?:Transaction;
  message?:any ;
  err?:any;
}
