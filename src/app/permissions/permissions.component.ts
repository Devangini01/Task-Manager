import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { pipe, Observable, Subscription  } from 'rxjs';
import { AuthenticationService, ApiService } from '@app/_services';
import { UserRes, User } from '@app/_models';
@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
	loading = false ;
	error = false ;
  userData ;
  message: string;
  message1: string;
  type: string ;
  done= false ;
  status = ['owner', 'manager', 'staff'];
  permissionForm: FormGroup ;
  private subUser: Subscription ;
  private save: Subscription ;
  constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private api: ApiService) { }

  ngOnInit(): void {
     const myObserver = {
      next: (res) => this.userData= res,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
    };
    this.subUser = this.authenticationService.getUsers()
      .subscribe(myObserver)
//     this.TransactionData=thi
//     this.authenticationService.getUsers()
//     .subscribe(data => this.userData = data);
//     
    this.permissionForm = this.formBuilder.group({
     

    });
    

  }
  
   get f() { return this.permissionForm.controls; }
   
  
  onSubmit(){
    this.save = this.authenticationService.updatePermission(this.userData)
    .subscribe(
      result=> {
        if(result.success){
          this.message1="Permission updated";
          this.done = true ;
          this.type ='info';
          this.authenticationService.getUsers()
          .subscribe(data => this.userData = data);
        }
        else{
          this.message="Unable to update"
          this.error = true ;
          this.type ='danger';
        }
      },
      err => {
        console.log("Error");
      }
    )
  
  }
   ngOnDestroy(): void{
   if(this.save){
      this.save.unsubscribe();
    }
  }
}

