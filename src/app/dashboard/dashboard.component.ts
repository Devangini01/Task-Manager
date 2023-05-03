import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { pipe, Observable, Subscription } from 'rxjs';

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
    
   
  }

  get f() { return this.dashForm.controls; }

  private currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0,10);
  }
  
 
    
  
  
  
      
  ngAfterViewInit() {
    setTimeout(() => {
      const chartElement1 = document.getElementById('chart1');
      const chart1 = getInstanceByDom(chartElement1);
      connect([chart1]);
    });
  }

}
