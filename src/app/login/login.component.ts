import { Component, OnInit } from '@angular/core';
﻿import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Role, User } from '@app/_models';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    user: User ;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
        console.log(this.authenticationService.userValue);
        // redirect to home if already logged in
      if(this.authenticationService.userValue){  
        if(this.authenticationService.userValue.isAdmin == 'owner'){
          console.log("Admin");
          this.router.navigate(['/task-status']);
        }else{
          this.router.navigate(['/task-status']);
        }
      }  
    }

    ngOnInit():void {
         this.user = this.authenticationService.userValue ;
          console.log(this.user);
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
       
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        
    }
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.submitted = false;
                    this.loading = false;
                    if(data.success){
                        if(data.data.isAdmin == 'owner'){
                          this.router.navigate(['/task-status']);
                        }else{
                          this.router.navigate(['/task-status']);
                        }
                        
                    }else{
                        this.error = data.message;
                        this.loading = false;
                    }
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }

}
