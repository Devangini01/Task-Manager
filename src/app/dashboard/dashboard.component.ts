import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { pipe, Observable, Subscription } from 'rxjs';
import { TransactionRes, Transaction, User, TaskRes, Task} from '@app/_models';
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService, ApiService } from '@app/_services';
import { getInstanceByDom, connect } from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  TransactionData;
  dashForm: FormGroup  ;
  trashIcon = faTrash ;
  approveIcon = faCheck ;
  obj;
  error = false ;
  loading = false;
  done= false ;
  type: string ;
  message: string;
  message1: string;
  taskData;
  time;
  private subTask: Subscription ;
  private subTransaction: Subscription ;

  options = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['Sunil', 'Anil', 'Madhu', 'Raju', 'Abc', 'PRR', 'DNC'],
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Hours',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220],
      },
    ],
  };


  constructor(
  	private api: ApiService,
    private formBuilder: FormBuilder,
  ) {
    this.dashForm= new FormGroup({
         editId: new FormControl()
       });
  }
  ngOnInit(): void {
    const myObserver = {
      next: (res) => this.TransactionData= res,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
    };
    this.obj={
      fromDateTime: this.currentDate(),
      toDateTime:  this.currentDate(),
    }
    this.subTransaction = this.api.getUnapprovedTransaction()
      .subscribe(myObserver)
    const myObserver1 = {
      next: (res) => this.taskData= res,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
    };
    this.subTask = this.api.getTaskByUser(this.obj)
      .subscribe(myObserver1)
//     this.time = this.taskData.data.taskBy.firstname;
//     console.log(this.time);
  }

  get f() { return this.dashForm.controls; }

  private currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0,10);
  }
  
  onApprove(id :string){
    if(this.f.editId.value != ""){
      this.obj = this.f.editId.value;
      this.api.approveTransaction(id)
        .subscribe(
        result=> {
          if(result.success){
             const myObserver = {
              next: (res) => this.TransactionData= res,
              err: (err) => {console.log(err)},
              complete: () => console.log('complete fetching data')
            };
            this.subTransaction = this.api.getUnapprovedTransaction()
              .subscribe(myObserver)
          }
        }, 
        err => {
          console.log("Error");
        }
      )
    }
  }
  
  delete(id:string){
    this.loading = true;
    this.api.deleteTransaction(id)
    .subscribe(
      result=> {
        if(result.success){
            this.loading = false;
            this.message1="Delete done"
            this.done = true ;
            this.type ='info';
            const myObserver = {
              next: (res) => this.TransactionData= res,
              err: (err) => {console.log(err)},
              complete: () => console.log('complete fetching data')
            };
            this.subTransaction = this.api.getUnapprovedTransaction()
              .subscribe(myObserver)
       //   this.TransactionData=this.api.getTransaction().pipe()
        }
        else{
            this.message="Error"
            this.loading = false;
            this.error = true ;
            this.type ='danger';
        }
      },
      error => {
        this.error = error;
        console.log("Error");
      }
    )
  }
  ngOnDestroy(): void{
    if(this.subTransaction){
      this.subTransaction.unsubscribe();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const chartElement1 = document.getElementById('chart1');
      const chart1 = getInstanceByDom(chartElement1);
      connect([chart1]);
    });
  }

}
