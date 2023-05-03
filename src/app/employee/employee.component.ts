import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { pipe, Subject, Observable, Subscription  } from 'rxjs';
import { AuthenticationService, ApiService } from '@app/_services';
import { UserRes, User } from '@app/_models';
import { faTrash, faEdit, faLock} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
	loading = false ;
	error = false;
  submitted = false;
  trashIcon = faTrash;
  editIcon = faEdit;
  lockIcon = faLock ;
  message: string ;
  message1: string ;
  done = false ;
  type : string;
  obj: User;
	employeeForm: FormGroup ;
  userData;
  private subUser: Subscription ;
  private save: Subscription ;
  constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private api: ApiService) { }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      firstname: ['', Validators.required],
        lastname : ['', Validators.required],
        username: ['',Validators.required],
        password: ['', Validators.required],
        address: ['', Validators.required],
        rePassword: ['',Validators.required],
        mobile: ['', Validators.required],
        email:  ['', Validators.required],
        isActive: [true],
        editId: ['']
      },
      {validator: this.checkIfMatchingPasswords('password', 'rePassword')}
    ); 
    const myObserver = {
      next: (res) => this.userData= res,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
    };
    this.subUser= this.authenticationService.getUsers()
      .subscribe(myObserver)
   // this.userData=this.authenticationService.getUsers().pipe()
  }
  
  checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
          passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true})
      }
      else {
          return passwordConfirmationInput.setErrors(null);
      }
    }
  }
  
  get f() { return this.employeeForm.controls; }
  
  onSubmit(){
    console.log(this.f.editId.value);
     if(this.f.editId.value == "" || this.f.editId.value == null){
    this.submitted = true;
    // stop here if form is invalid
    if (this.employeeForm.invalid) {
      return;
    }
    this.loading = true;
   
      this.save = this.authenticationService.registration(
        this.f.username.value, 
        this.f.password.value, 
        this.f.firstname.value,
        this.f.lastname.value,
        this.f.mobile.value,
        this.f.address.value,
        this.f.email.value,
        this.f.isActive.value,
      )
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          this.submitted = false;
          if(data.success){
            this.message1="Save done"
            this.done = true ;
            this.type ='info';
            const myObserver = {
              next: (res) => this.userData= res ,
              err: (err) => {console.log(err)},
              complete: () => console.log('complete fetching data')
            };
            this.subUser= this.authenticationService.getUsers()
              .subscribe(myObserver)
            this.BlankForm();
          }else{
            this.error = data.message;
            this.loading = false;
          }
        },
        error => {
            this.error = error;
            this.loading = false;
        }
      );
    }else{
      this.obj={
          'id' : this.f.editId.value,
          'username' : this.f.username.value,
          'firstname' : this.f.firstname.value,
          'lastname' : this.f.lastname.value,
          'mobile' : this.f.mobile.value,
          'address' : this.f.address.value,
          'email' : this.f.email.value,
          'isActive': this.f.isActive.value
      }
      this.save = this.authenticationService.updateUser(this.obj)
      .subscribe(
        result=> {
          this.BlankForm();
          console.log(result);
          if(result.success){
            this.message1="Update done"
            this.done = true ;
            this.type ='info';
             const myObserver = {
              next: (res) => this.userData= res,
              err: (err) => {console.log(err)},
              complete: () => console.log('complete fetching data')
            };
            this.subUser= this.authenticationService.getUsers()
                          .subscribe(myObserver)
            this.employeeForm.controls['password'].enable();
            this.employeeForm.controls['rePassword'].enable(); 
          }
        },
        error => {
          this.error = error;
          console.log(error);
        }
      )
    }
  }
  
  delete(id:string){
    this.authenticationService.deleteUser(id)
    .subscribe(
      result=> {
        if(result.success){
          this.message1="Delete done"
          this.done = true ;
          this.type ='info';
            const myObserver = {
            next: (res) => this.userData= res,
            err: (err) => {console.log(err)},
            complete: () => console.log('complete fetching data')
          };
          this.subUser= this.authenticationService.getUsers()
            .subscribe(myObserver)
        }
      },
      error => {
        this.error = error;
      }
    )
  }
  
  getSingleUser(id: string){
     this.authenticationService.getSingleUser(id)
    .subscribe(
      result=>{
        if(result.success){
          console.log(result);
          this.employeeForm.setValue({
            firstname:result.data.firstname,
            lastname:result.data.lastname,
            mobile:result.data.mobile,
            address:result.data.address,
            email:result.data.email,
            isActive: result.data.isActive,
            username:result.data.username,
            password:'',
            rePassword:'',
            editId:result.data.id,
          });
          this.employeeForm.controls['password'].disable();
          this.employeeForm.controls['rePassword'].disable();         
        }
      },
      err => {
        console.log("Error");
      }
    )
  }
  
//   changePassword(id :string){
//       this.authenticationService.changePassword(id)
//         .subscribe(
//         result=> {
//           if(result.success){
//              const myObserver = {
//               next: (res) => this.userData= res,
//               err: (err) => {console.log(err)},
//               complete: () => console.log('complete fetching data')
//             };
//             this.subUser= this.authenticationService.changePassword()
//               .subscribe(myObserver)
//           }
//         }, 
//         err => {
//           console.log("Error");
//         }
//       )
//     }
  
  
  BlankForm(){
    this.employeeForm.reset();
  }  
  ngOnDestroy(): void{
    if(this.save){
      this.save.unsubscribe();
    }
    if(this.subUser){
      this.subUser.unsubscribe();
    }
  }
}
