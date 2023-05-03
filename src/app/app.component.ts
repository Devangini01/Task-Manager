import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User, Role } from './_models';
import { faMoneyBillAlt, faReceipt, faTasks, faPlus, faUserPlus, faFileInvoice, faCashRegister, faList, faListUl , faUser, faListAlt, faUserCheck, faUserCog, faSignOutAlt, faUsersCog } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'accounts' ;
  user: User ;
  collapsed = true ;
  paymentIcon = faFileInvoice ; 
  receiptIcon = faCashRegister ;
  taskIcon = faTasks ;
  plusIcon = faPlus ;
  addUserIcon = faUserPlus ;
  userIcon = faUser ;
  listIcon = faUsersCog;
  listAltIcon = faListAlt ;
  listUl = faListUl ;
  userCheckIcon = faUserCheck ;
  permissionIcon = faUserCog ;
  logoutIcon = faSignOutAlt;
  constructor(
      private router: Router,
      private authenticationService: AuthenticationService
  ) {
      this.authenticationService.user.subscribe(x => this.user = x);
  }
  
  get isAdmin() {
    return this.user && this.user.isAdmin === Role.owner;
  }
  
  get isStaff() {
    return this.user && this.user.isAdmin === Role.staff;
  }
  
  get isManager() {
    return this.user && this.user.isAdmin === Role.manager;
  }
  
  logout() {
      this.authenticationService.logout();
  }
}
