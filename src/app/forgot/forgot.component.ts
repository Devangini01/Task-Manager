import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
	error = "";
	loading = "";
	forgotForm: FormGroup ;
	submitted = false ;
  constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  	this.forgotForm = this.formBuilder.group({
        username: ['', Validators.required],
    });
  }

   get f() { return this.forgotForm.controls; }

   onSubmit(){}
}
