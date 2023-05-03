import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { pipe, Observable, Subscription  } from 'rxjs';
import { TaskRes, Task, User} from '@app/_models';
import { AuthenticationService, ApiService } from '@app/_services';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.scss']
})
export class TaskStatusComponent implements OnInit {
	loading = false ;
	error = false ;
  taskStatusForm: FormGroup ;
  meridian = true;
  message: string ;
  message1: string ;
  done = false ;
  type : string;
  obj: Task ;
  taskData;
  taskList; //This will Task set by admin
  private save: Subscription ;
  user : User;
  fromTime : string;
  toTime : string ;
  private subTask: Subscription ;
  private subAllTask: Subscription ;
  time={
    time1: {hour: 15, minute: 30},
    time2:{hour: 17, minute: 30} } ;
  constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private api: ApiService) { }

  ngOnInit(): void {
    this.user = this.authenticationService.userValue ;
 //   this.taskData=this.api.getTasks(this.user.id).pipe()
    const myObserver = {
      next: (res) => this.taskData= res,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
    };
    this.subTask= this.api.getTasks(this.user.id)
      .subscribe(myObserver)
    
    this.taskStatusForm = this.formBuilder.group({
      date:[this.currentDate()],
      fromDateTime:[this.time.time1],
      toDateTime:[this.time.time2],
      task:[''],
      taskSet: ['']
    });
    const myObserver1 = {
      next: (res) => this.taskList = res,
      err: (err) => {console.log(err)},
      complete: () => console.log('complete fetching data')
    };
    this.subAllTask = this.api.getAllAddTasks()
        .subscribe(myObserver1)
  }
  private currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0,10);
  }

  get f() { return this.taskStatusForm.controls; }

  onSubmit(){
    this.loading = true;
    this.toTime = this.f.date.value + ' ' + this.f.toDateTime.value.hour + ':' + this.f.toDateTime.value.minute + ' UTC' ;
    this.fromTime = this.f.date.value + ' ' + this.f.fromDateTime.value.hour + ':' + this.f.fromDateTime.value.minute + ' UTC'  ;

    this.obj={
      'taskBy':this.user.id,
      'toDateTime':this.toTime,
      'fromDateTime':this.fromTime,
      'task': this.f.taskSet.value != "" ? this.f.taskSet.value : this.f.task.value,
    }
    this.save = this.api.saveTask(this.obj)
    .pipe(first())
      .subscribe(
        data => {
          if(data.success){
            this.loading = false;
            this.message1="Save done"
            this.done = true ;
            this.type ='info';
            const myObserver = {
              next: (res) => this.taskData= res,
              err: (err) => {console.log(err)},
              complete: () => console.log('complete fetching data')
              };
              this.subTask= this.api.getTasks(this.user.id)
                .subscribe(myObserver)
            this.BlankForm();
            this.taskStatusForm.patchValue({
              date: this.currentDate(),
              toDateTime : this.time.time1,
              fromDateTime : this.time.time2
            });
            this.error=false;
            this.message = data.message ;
            console.log(this.message);
            this.type = 'info'
          }else{
            this.error=true;
            this.loading = false;
            this.message = data.err.message ;
            console.log(this.message);
            this.type = 'danger';
          }
        },
        err => {
          this.error = err;
          if(!err.success){
            console.log(err.message);
          }
        });
  }
  BlankForm(){
    this.taskStatusForm.reset();
  }
  delete(id){
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
      }
    )
  }
  ngOnDestroy(): void{
    if(this.save){
      this.save.unsubscribe();
    }
    if(this.subTask){
      this.subTask.unsubscribe();
    }
  }
}
