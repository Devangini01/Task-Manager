import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
	registration: FormGroup ;
	loading = false ;
	submitted = false;
  returnUrl: string;		
  error = '';
  constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  	this.registration = this.formBuilder.group({
        firstname: ['', Validators.required],
        lastname : ['', Validators.required],
        username: ['',Validators.required],
        password: ['', Validators.required],
        address: ['', Validators.required],
        rePassword: ['',Validators.required],
        mobile: ['', Validators.required],
        email:  ['', Validators.required],
        isActive: ['', Validators.required]
      },
      {validator: this.checkIfMatchingPasswords('password', 'rePassword')}
      );
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

  // convenience getter for easy access to form fields
    get f() { return this.registration.controls; }
    onSubmit(){
         this.submitted = true;
      // stop here if form is invalid
        if (this.registration.invalid) {
            return;
        }
        this.loading = true;
        this.authenticationService.registration(
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
                    this.router.navigate(['/dashboard'])
                  }else{
                    this.error = data.message;
                  }
                    //console.log('data', data);
                    //this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}
