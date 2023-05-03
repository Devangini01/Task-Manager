import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { EmployeeComponent } from './employee/employee.component';
// import { PartyComponent } from './party/party.component';
import { TaskComponent } from './task/task.component';
// import { PaymentComponent } from './payment/payment.component';
// import { ReceiptsComponent } from './receipts/receipts.component';
// import { PermissionsComponent } from './permissions/permissions.component';
import { TaskStatusComponent } from './task-status/task-status.component';
// import { AttendanceComponent } from './attendance/attendance.component';
// import { LedgerComponent } from './ledger/ledger.component';
// import { ForgotComponent } from './forgot/forgot.component';
// import { PartyledgerComponent } from './partyledger/partyledger.component';
import { AllocateTaskComponent } from './allocate-task/allocate-task.component';
import { ExpenseTrackerComponent } from './expense-tracker/expense-tracker.component';
import { Role } from './_models';

const routes: Routes = [
	{ path: 'login', component : LoginComponent  },
	{ path: 'registration', component : RegistrationComponent  , canActivate: [AuthGuard]},
	
	{ path: 'task', component : TaskComponent  , canActivate: [AuthGuard]},
	
	{ path: 'task-status', component : TaskStatusComponent , canActivate: [AuthGuard]},

	{ path: 'dashboard', component : DashboardComponent  , canActivate: [AuthGuard], data: { roles: [Role.owner] } },
	
  
  { path: 'addTask', component: AllocateTaskComponent , canActivate: [AuthGuard], data: { roles: [Role.owner] } },
	{ path: '', redirectTo: '/login', pathMatch: 'full'},

	{ path: 'expensetracker', component : ExpenseTrackerComponent  , canActivate: [AuthGuard], data: { roles: [Role.owner,Role.manager] } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
