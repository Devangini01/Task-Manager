import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { pipe, Observable, Subscription  } from 'rxjs';
import { AuthenticationService, ApiService } from '@app/_services';
import { TransactionRes, Transaction, User} from '@app/_models';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
	loading = false ;
	error = false ;
  trashIcon = faTrash;
  editIcon=faEdit;
  date;
  type: string ;
  payment=0;
  done= false ;
  message: string;
  message1: string;
  ledgerForm : FormGroup ;
  transactionData ;
  transactionData1;
  private subTransaction: Subscription ;
  private subTransaction1: Subscription ;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  	private api: ApiService) { }

  ngOnInit(): void {
    this.getData(this.currentDate() );

    this.ledgerForm = this.formBuilder.group({
      date:[this.currentDate()],
    });
    this.date=this.f.date.value;
    this.getBalance(this.f.date.value);
  }

  getData(date){
     const myObserver = {
      next: (res) => this.transactionData = res,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
    };
    this.subTransaction = this.api.getTransaction(date)
      .subscribe(myObserver)
  }

  getBalance(date){
    const myObserver = {
      next: (res) => this.transactionData1 = res,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
    };
    this.subTransaction = this.api.getOpenBalance(date)
      .subscribe(myObserver)
//     this.api.getOpenBalance( date )
//       .subscribe(data => this.transactionData1 = data);
  }

  private currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0,10);
  }

  get f() { return this.ledgerForm.controls; }


  delete(id:string){
    this.loading = true;
    this.api.deleteTransaction(id)
    .subscribe(
      result=> {
        if(result.success){
            this.loading = false;
            this.message1="Delete done"
            this.done = true ;
            this.type ='info';
            this.getData(this.f.date.value);
            this.getBalance(this.f.date.value);
       //   this.TransactionData=this.api.getTransaction().pipe()
        }
        else{
            this.message="Error"
            this.loading = false;
            this.error = true ;
            this.type ='danger';
        }
      },
      error => {
        this.error = error;
        console.log("Error");
      }
    )
  }

  getTotal(type : string ){
    if(!this.transactionData || this.transactionData == undefined){
      return 0;
    }
    return this.transactionData.data
    .filter(i=> i.paymentType== type )
    .reduce((i,j)=>i+j.amount,0);
  }

  onSubmit(){
    this.getData(this.f.date.value);
    this.getBalance(this.f.date.value);
  }

   ngOnDestroy(): void{
    if(this.subTransaction){
       this.subTransaction.unsubscribe();
    }
    if(this.subTransaction1){
       this.subTransaction1.unsubscribe();
    }
  }
}
