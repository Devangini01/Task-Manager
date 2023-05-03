import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { BasicAuthInterceptor, ErrorInterceptor } from './_helpers';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { EmployeeComponent } from './employee/employee.component';
// import { PartyComponent } from './party/party.component';
import { TaskComponent } from './task/task.component';
import { TaskStatusComponent } from './task-status/task-status.component';
// import { PaymentComponent } from './payment/payment.component';
// import { ReceiptsComponent } from './receipts/receipts.component';
import { PermissionsComponent } from './permissions/permissions.component';
// import { AttendanceComponent } from './attendance/attendance.component';
// import { LedgerComponent } from './ledger/ledger.component';
// import { ForgotComponent } from './forgot/forgot.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { PartyledgerComponent } from './partyledger/partyledger.component';
import { AllocateTaskComponent } from './allocate-task/allocate-task.component';

import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ExpenseTrackerComponent } from './expense-tracker/expense-tracker.component';

// import {TimeAgoPipe} from 'time-ago-pipe';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
   
    TaskComponent,
    TaskStatusComponent,
   
    PermissionsComponent,
   
    AllocateTaskComponent,
    ExpenseTrackerComponent,
//     TimeAgoPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
  ],
   providers: [
        { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
   ],
   bootstrap: [AppComponent]
})
export class AppModule { }
