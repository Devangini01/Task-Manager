import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map, catchError } from 'rxjs/operators';
import { pipe, Subject, Observable , Subscription } from 'rxjs';
import { PartyRes, Party } from '@app/_models';
import { TransactionRes, Transaction, User} from '@app/_models';
import { AuthenticationService, ApiService } from '@app/_services';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
	loading = false ;
	error = false ;
  type : string;
  date;
  done = false ;
  paymentForm: FormGroup  ;
  denomination : FormGroup ;
  obj: Transaction ;
  user :User;
  message: string ;
  message1: string ;
  id;
  AccountsData;
  private subAccount: Subscription ;
  private save: Subscription ;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private api: ApiService,
  ){}

  ngOnInit(): void {
    this.id=this.route.snapshot.paramMap.get('transactionId');
    this.user = this.authenticationService.userValue ;
    if(this.id){
     this.getSinglePayment(this.id);
    }
    this.paymentForm = this.formBuilder.group({
      date:[this.currentDate()],
      accounts: ['', Validators.required],
      name:[''],
      narration:[''],
      amount:[''],
      editId: [''],
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
//     this.AccountsData=this.api.getAccountData().pipe()

  }

  private currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0,10);
  }

  private getDate(date){
    return date.substring(0,10);
  }

  get f() { return this.paymentForm.controls; }

  get currency(): any {
    return this.paymentForm.get('denomination');
  }

  set setDate(val: any){
    this.paymentForm.controls = val;
  }

  onSubmit(){
  if(this.f.editId.value==null || this.f.editId.value==""){
    this.loading = true ;
    this.obj = {
      'date': new Date(this.f.date.value),
      'account':this.f.accounts.value,
      'name': this.f.name.value,
      'narration':this.f.narration.value,
      'amount':this.f.amount.value,
      'paymentType':'payment',
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

    this.save = this.api.savePayment(this.obj)
    .pipe(first())
      .subscribe(
        data => {
          this.loading = false ;
          if(data.success){
            this.message1="Save done"
            this.done = true ;
            this.type ='info';
            this.BlankForm();
            this.paymentForm.patchValue({
              date: this.currentDate()
            });
            this.error=false;

            /*this.message = data.message ;            */

            this.type = 'info'
          }else{
            this.message = data.err.message ;
            this.loading = false ;
              this.error=true;
              this.type = 'danger';
          }
        },
        err => {
          this.error = err;
          this.loading = false ;
          if(!err.success){
            console.log(err.message);
          }
        });
    }else{
      this.obj = {
        'id':this.f.editId.value,
        'date': new Date(this.f.date.value),
        'account':this.f.accounts.value,
        'name':this.f.name.value,
        'narration':this.f.narration.value,
        'amount':this.f.amount.value,
        'paymentType':'payment',
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
            this.type='info';
            const myObserver = {
              next: (res) => this.AccountsData= res,
              err: (err) => {console.log(err)},
              complete: () => console.log('complete fetching data')
            };
            this.subAccount = this.api.getAccountData()
              .subscribe(myObserver)
            this.message = result.message ;
            this.type = 'info';
          }
        },
        err => {
          this.error = err;
          this.message = err ;
          this.type = 'warning';

        }
      )
    }
  }
  getSinglePayment(id: string){
    //API for gett single Accounts
     this.api.getSinglePayment(id)
    .subscribe(
      result=>{
        if(result.success){
          let date1=this.getDate(result.data.date);
           this.paymentForm.setValue({
              date: date1,
              accounts: result.data.account,
              name: result.data.name,
              narration: result.data.narration,
              amount: result.data.amount,
              editId: result.data._id,
             // transactionBy:result.data.transactionBy,
              denomination:result.data.denomination,
            });
        }
      },
      err => {
        console.log("Error");
      }
    )
  }

  BlankForm(){
    this.paymentForm.reset();

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

