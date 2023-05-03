import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { pipe, Observable, Subscription  } from 'rxjs';
import { TaskRes, Task, User} from '@app/_models';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService, ApiService } from '@app/_services';
import {FormsModule} from '@angular/forms';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx'; 
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
	loading = false ;
	error = false ;
  done = false ;
  type: string;
  message: string ;
  message1: string ;
  trashIcon = faTrash;
  taskData;
  userData ;
  meridian = true;
  obj:any;
  fileName= 'ExcelSheet.xlsx';  
  private save: Subscription ;
  private subTask: Subscription ;
  private subUser: Subscription ;
  taskForm = {
    time: {hour: 15, minute: 30},
    time2:{hour: 17, minute: 30} 
  } ;
  tasksForm : FormGroup ;
  constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private api: ApiService) { }

  ngOnInit(): void {
    this.tasksForm = this.formBuilder.group({
      fromDate:[this.currentDate()],
      toDate:[this.currentDate()],
      users:[''],
    });
    this.obj={
      fromDateTime: this.currentDate(),
      toDateTime:  this.currentDate(),
    }
    const myObserver = {
      next: (res) => this.taskData= res,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
    };
    this.subTask = this.api.getTaskByUser(this.obj)
      .subscribe(myObserver)
    
    const myObserver1 = {
      next: (res) => this.userData= res,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
    };
    this.subUser= this.authenticationService.getUserData()
      .subscribe(myObserver1)
    
    console.log(this.save);
  }
  
  private currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0,10);
  }
  
  get f() { return this.tasksForm.controls; }
  delete(id:string){
    this.api.deleteTask(id)
    .subscribe(
      result=> {
        if(result.success){
          this.message1="Delete done"
            this.done = true ;
            this.type ='info';
           const myObserver = {
              next: (res) => this.taskData= res,
              err: (err) => {console.log(err)},
              complete: () => console.log('complete fetching data')
            };
            this.subTask = this.api.getAllTasks()
              .subscribe(myObserver)
        }
      },
      error => {
        this.error = error;
        this.message= "Error"
            this.error = true ;
            this.type ='danger';
        console.log("Error");
      }
    )
  }
  
  
  getTaskByUser(){
    
    this.obj={
      taskBy:this.f.users.value,
      fromDateTime: this.f.fromDate.value,
      toDateTime:  this.f.toDate.value,
    }
    const myObserver = {
      next: (res) => this.taskData= res,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
    };
    this.subTask = this.api.getTaskByUser(this.obj)
      .subscribe(myObserver)
    
  }
  
  
exportexcel(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('excel-table'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
			
    }
  
  BlankForm(){
    this.tasksForm.reset();
  }
   ngOnDestroy(): void{
    this.subTask.unsubscribe();
    this.subUser.unsubscribe();
  }
}
