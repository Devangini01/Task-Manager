import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { PartyComponent } from './party/party.component';
import { TaskComponent } from './task/task.component';
import { PaymentComponent } from './payment/payment.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { TaskStatusComponent } from './task-status/task-status.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { LedgerComponent } from './ledger/ledger.component';
import { ForgotComponent } from './forgot/forgot.component';
import { PartyledgerComponent } from './partyledger/partyledger.component';
import { AllocateTaskComponent } from './allocate-task/allocate-task.component';
import { ExpenseTrackerComponent } from './expense-tracker/expense-tracker.component';
import { Role } from './_models';

const routes: Routes = [
	{ path: 'login', component : LoginComponent  },
	{ path: 'registration', component : RegistrationComponent  , canActivate: [AuthGuard]},
	{ path: 'employees', component : EmployeeComponent  , canActivate: [AuthGuard], data: { roles: [Role.owner] } },
	{ path: 'party', component : PartyComponent  , canActivate: [AuthGuard], data: { roles: [Role.owner,Role.manager] } },
	{ path: 'task', component : TaskComponent  , canActivate: [AuthGuard]},
	{ path: 'payment', component : PaymentComponent  , canActivate: [AuthGuard] , data: { roles: [Role.owner,Role.manager] } },
  { path: 'payment/edit/:transactionId', component : PaymentComponent  , canActivate: [AuthGuard], data: { roles: [Role.owner,Role.manager] } },
	{ path: 'receipts', component : ReceiptsComponent , canActivate: [AuthGuard],data: { roles: [Role.owner,Role.manager] } },
  { path: 'receipt/edit/:transactionId', component : ReceiptsComponent , canActivate: [AuthGuard], data: { roles: [Role.owner,Role.manager] } },
	{ path: 'task-status', component : TaskStatusComponent , canActivate: [AuthGuard]},
	{ path: 'permissions', component : PermissionsComponent,canActivate: [AuthGuard],data: { roles: [Role.owner] } },
	{ path: 'dashboard', component : DashboardComponent  , canActivate: [AuthGuard], data: { roles: [Role.owner] } },
	{ path: 'attendance', component : AttendanceComponent  , canActivate: [AuthGuard]},
	{ path: 'ledger', component : LedgerComponent  , canActivate: [AuthGuard], data: { roles: [Role.owner,Role.manager] } },
	{ path: 'forgot', component : ForgotComponent },
  { path : 'partyledger/:accountId', component : PartyledgerComponent,canActivate: [AuthGuard], data: { roles: [Role.owner,Role.manager] }  },
  { path: 'addTask', component: AllocateTaskComponent , canActivate: [AuthGuard], data: { roles: [Role.owner] } },
	{ path: '', redirectTo: '/login', pathMatch: 'full'},

	{ path: 'expensetracker', component : ExpenseTrackerComponent  , canActivate: [AuthGuard], data: { roles: [Role.owner,Role.manager] } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
