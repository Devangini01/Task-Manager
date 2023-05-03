import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { pipe, Observable, Subscription  } from 'rxjs';
import { AuthenticationService, ApiService } from '@app/_services';
import { TransactionRes, Transaction, User} from '@app/_models';
@Component({
  selector: 'app-partyledger',
  templateUrl: './partyledger.component.html',
  styleUrls: ['./partyledger.component.scss']
})
export class PartyledgerComponent implements OnInit {
  partyledgerData ;
  id;

  private subPartyLedger: Subscription ;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  	private api: ApiService
  ) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.paramMap.get('accountId');
    if(this.id){
      this.getData(this.id);
    }

  }
  currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0,10);
  }

   getData(id){
      const myObserver = {
      next: (res) => this.partyledgerData= res,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
    };
    this.subPartyLedger = this.api.getTransactionByAccount(id)
      .subscribe(myObserver)
//     this.api.getTransactionByAccount( id )
//       .subscribe(data => this.partyledgerData = data);
  }

    getTotal(type : string ){
    if(!this.partyledgerData || this.partyledgerData == undefined){
      return 0;
    }
    return this.partyledgerData.data
    .filter(i=> i.paymentType== type )
    .reduce((i,j)=>i+j.amount,0);
  }

   ngOnDestroy(): void{
    this.subPartyLedger.unsubscribe();
  }

}
