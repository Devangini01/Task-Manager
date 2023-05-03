import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map, catchError } from 'rxjs/operators';
import { pipe, Observable, Subscription  } from 'rxjs';
import { PartyRes, Party } from '@app/_models';
import { TransactionRes, Transaction, User} from '@app/_models';
import { AuthenticationService, ApiService } from '@app/_services';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss']
})
export class ReceiptsComponent implements OnInit {
  loading = false ;
  error = false ;
  type : string;
  receiptForm: FormGroup  ;
  denomination : FormGroup  ;
  obj: Transaction ;
  user :User;
  done = false ;
  id;
  date;
  message: string ;
  message1: string ;
  AccountsData;
  private subAccount: Subscription ;
  private save: Subscription ;
  constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private api: ApiService) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.paramMap.get('transactionId');
    this.user = this.authenticationService.userValue ;
    console.log('transaction' , this.id);
    if(this.id){
      this.getSingleReceipt(this.id);
    }
    this.receiptForm = this.formBuilder.group({
      date:[this.currentDate()],
      accounts: ['', Validators.required],
      name:[''],
      narration:[''],
      amount:[''],
      editId:[''],
      denomination: this.formBuilder.group({
        rs2000:[''],
        rs500:[''],
        rs200:[''],
        rs100:[''],
        rs50:[''],
        rs20:[''],
        rs10:[''],
        coins:['']
      })
    });
    const myObserver = {
      next: (res) => this.AccountsData= res,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
    };
    this.subAccount = this.api.getAccountData()
      .subscribe(myObserver)
  }

  private currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0,10);
  }

  private getDate(date){
    return date.substring(0,10);
  }

  get f() { return this.receiptForm.controls; }

  get currency(): any {
    return this.receiptForm.get('denomination');
  }
  onSubmit(){
    if(this.f.editId.value==null || this.f.editId.value == ""){
      this.loading = true ;
      this.obj = {
        'date': new Date(this.f.date.value),
        'account':this.f.accounts.value,
        'name':this.f.name.value,
        'narration':this.f.narration.value,
        'amount':this.f.amount.value,
        'paymentType':'receipt',
        'transactionBy': this.user.id,
        'denomination' : /*this.currency.value,*/ {
          'rs2000': this.currency.value.rs2000,
          'rs500': this.currency.value.rs500,
          'rs200':this.currency.value.rs200,
          'rs100':this.currency.value.rs100,
          'rs50':this.currency.value.rs50,
          'rs20':this.currency.value.rs20,
          'rs10':this.currency.value.rs10,
          'coins':this.currency.value.coins,
        }
      }
      this.save = this.api.saveReceipt(this.obj)
      .pipe(first()).subscribe(
        data => {
          this.loading = false;
          if(data.success){
            
            this.message1="Save done"
            this.done = true ;
            this.type ='info';
            console.log(data);
            this.BlankForm();
            this.receiptForm.patchValue({
              date: this.currentDate()
            });
            this.error=false;
            this.message = data.message ;
            console.log(this.message);
            this.type = 'info'
          }else{
              this.error=true;
              this.loading = false;
              this.message = data.err.message ;
              console.log(this.message);
      
              this.type = 'danger';
          }
        },
        err => {
          this.error = err;
          this.loading = false;
        });
    }else{
      this.obj = {
        'id':this.f.editId.value,
        'date': new Date(this.f.date.value),
        'account':this.f.accounts.value,
        'name':this.f.name.value,
        'narration':this.f.narration.value,
        'amount':this.f.amount.value,
        'paymentType':'receipt',
        'transactionBy': this.user.id,
        'denomination' : /*this.currency.value,*/ {
          'rs2000': this.currency.value.rs2000,
          'rs500': this.currency.value.rs500,
          'rs200':this.currency.value.rs200,
          'rs100':this.currency.value.rs100,
          'rs50':this.currency.value.rs50,
          'rs20':this.currency.value.rs20,
          'rs10':this.currency.value.rs10,
          'coins':this.currency.value.coins,
        }
      }
      this.save = this.api.updatePayment(this.obj)
       .subscribe(
        result=> {
          this.BlankForm();
          if(result.success){
            this.message1="Update done"
            this.done = true ;
            this.type ='info';
            console.log(this.obj);
          }
        },
        err => {
          this.error = err;
          console.log(err);
        }
      )
    }

  }
  getSingleReceipt(id: string){
    //API for get single Receipt
     this.api.getSinglePayment(id)
    .subscribe(
      result=>{
        if(result.success){
          console.log(result);
          let date1=this.getDate(result.data.date);
          console.log(date1);
           this.receiptForm.setValue({
              date: date1,
              accounts: result.data.account,
              name: result.data.name,
              narration: result.data.narration,
              amount: result.data.amount,
              editId: result.data._id,
             // transactionBy:result.data.transactionBy,
              denomination:result.data.denomination,
            });
          console.log("getSingleReceipt");
        }
      },
      err => {
        console.log("Error");
      }
    )
  }
  BlankForm(){
    this.receiptForm.reset();
  }
   ngOnDestroy(): void{
    if(this.save){
      this.save.unsubscribe();
    }
    if(this.subAccount){
      this.subAccount.unsubscribe();
    }
  }
  
}
