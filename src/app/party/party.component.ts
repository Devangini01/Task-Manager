import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first,map, catchError} from 'rxjs/operators';
import { pipe, Subject, Observable, Subscription  } from 'rxjs';
import { PartyRes, Party } from '@app/_models';
import { AuthenticationService, ApiService } from '@app/_services';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent implements OnInit,OnDestroy {
	loading = false ;
	error = false ;
  type: string ;
  done= false ;
  partyForm: FormGroup  ;
  AccountsData:Observable<any>;
  parties=PartyRes;
  trashIcon = faTrash;
  editIcon=faEdit;
  Obj: Party ;
  submitted = false ;
  checked=true;
  message:string;
  message1:string;
  private subAccount: Subscription ;
  private save: Subscription ;
  private ngUnsubscribe: Subject<void> = new Subject();
  constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private api: ApiService) {
          this.partyForm = new FormGroup({

       });
  }

  ngOnInit(): void {
    this.partyForm = this.formBuilder.group({
      name: ['', Validators.required],
      contact_no: [''] ,
      isActive: [''],
      editId: ['']
     });
    const myObserver = {
      next: (res) => this.AccountsData= res.data ,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
     };

    this.subAccount = this.api.getAccounts()
      .subscribe(myObserver)
  }

  get f() { return this.partyForm.controls; }
  //set f() { return this.partyForm.controls; }

  onSubmit(){
    this.submitted = true;
    this.loading = true;
    // stop here if form is invalid
    if (this.partyForm.invalid) {
        this.loading = false;
        return;
    }
    if(this.f.editId.value == "" || this.f.editId.value == null){
      let isActive = (this.f.isActive.value) ? true : false ; 
      console.log(isActive , this.f.isActive.value);
      this.save = this.api.saveAccount(
        this.f.name.value,
        this.f.contact_no.value,
        isActive ,
      )
      .pipe(first())
      .subscribe(
        data => {
          this.submitted = false ;
           this.loading = false;
          if(data.success){
           
            this.message1="Save done"
            this.done = true ;
            this.type ='info';
            this.BlankForm();
             const myObserver = {
              next: (res) => this.AccountsData= res.data ,
              err: (err) => {console.log(err)},
              complete: () => console.log('complete fetching data')
            };
            this.subAccount = this.api.getAccounts()
              .subscribe(myObserver)
//             this.AccountsData=this.api.getAccounts().pipe()
          }else{
             
             this.message = data.err.message ;
             this.loading = false;
             this.error=true;
             this.type = 'danger';
          }
        },
        error => {
          this.loading = false;
          this.error = error;
          this.message = error ;
          this.error=true;
          this.type = 'warning';
        });
    }else{
      this.Obj = {
        	id: this.f.editId.value,
          partyName: this.f.name.value,
          contact: this.f.contact_no.value,
          isActive: this.f.isActive.value
      }
      this.save = this.api.updateAccount(this.Obj)
      .subscribe(
        result=> {
          this.BlankForm();
          if(result.success){
            this.loading = false;
            this.message1="Update done"
            this.done = true ;
            this.type='info';
            const myObserver = {
              next: (res) => this.AccountsData= res.data ,
              err: (err) => {console.log(err)},
              complete: () => console.log('complete fetching data')
            };
            this.subAccount = this.api.getAccounts()
              .subscribe(myObserver)
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
  getSingleAccount(id: string){
    //API for gett single Accounts
    // restForm = response
     this.api.getSingleAccount(id)
    .subscribe(
      result=>{
        if(result.success){
           this.partyForm.setValue({
              name:result.data[0].partyName,
              contact_no:result.data[0].contact,
              isActive:result.data[0].isActive,
              editId:result.data[0].id,
            });
        }
      },
      err => {
        console.log("Error");
      }
    )
  }

  delete(id:string){
    this.api.deleteAccounts(id)
    .subscribe(
      result=> {
        if(result.success){
            this.message1="Delete done"
            this.done = true ;
            this.type="info";
            const myObserver = {
              next: (res) => this.AccountsData= res.data ,
              err: (err) => {console.log(err)},
              complete: () => console.log('complete fetching data')
            };
            this.subAccount = this.api.getAccounts()
              .subscribe(myObserver)
            
        }
      },
      error => {
        this.error = error;
      }
    )
  }

  update(id:string){

  }

  BlankForm(){
    this.partyForm.reset();
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
