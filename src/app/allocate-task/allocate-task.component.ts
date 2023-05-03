import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map, catchError } from 'rxjs/operators';
import { pipe, Subject, Observable , Subscription } from 'rxjs';
import { AuthenticationService, ApiService } from '@app/_services';
import { AddTask, AddTaskRes} from '@app/_models';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-allocate-task',
  templateUrl: './allocate-task.component.html',
  styleUrls: ['./allocate-task.component.scss']
})
export class AllocateTaskComponent implements OnInit {
  addTaskForm: FormGroup ;
  addTaskData ;
  loading = false ;
  obj: AddTask ;
  error = false ;
  done= false ;
  type: string ;
  message: string ;
  message1:string;
  trashIcon = faTrash;
  private subTask: Subscription ;
  private save: Subscription ;
  constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private api: ApiService) { }

  ngOnInit(): void {
    this.addTaskForm = this.formBuilder.group({
      task:[''],
    });
    const myObserver = {
            next: (res) => this.addTaskData= res,
            err: (err) => {console.log(err)},
            complete: () => console.log('complete fetching data')
          };
          this.subTask= this.api.getAllAddTasks()
           .subscribe(myObserver)
  }
  
  get f() { return this.addTaskForm.controls; }
  
  onSubmit(){
    this.loading = true ;
    this.obj ={
      'task': this.f.task.value,
    }
    this.save = this.api.saveAddTask(this.obj)
    .pipe(first())
    .subscribe(
      data => {
        this.loading = false;
        this.message1="Save done"
        this.done = true ;
        this.type ='info';
        if(data.success){
          this.BlankForm();
          const myObserver = {
            next: (res) => this.addTaskData= res,
            err: (err) => {console.log(err)},
            complete: () => console.log('complete fetching data')
          };
          this.subTask= this.api.getAllAddTasks()
           .subscribe(myObserver)
        }
        else{
          this.error=true;
          this.loading = false;
          this.message = data.err.message ;
          this.type = 'danger';
        }
      },
      err => {
        console.log("Error");
      }
    )
  }
  
  delete(id:string){
    this.api.deleteAddTask(id)
    .subscribe(
      result=> {
        if(result.success){
          this.message1="Delete done"
          this.done = true ;
          this.type ='info';
           const myObserver = {
              next: (res) => this.addTaskData= res,
              err: (err) => {console.log(err)},
              complete: () => console.log('complete fetching data')
            };
          this.subTask = this.api.getAllAddTasks()
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
  BlankForm(){
    this.addTaskForm.reset();
  }
   ngOnDestroy(): void{
    if(this.subTask){
       this.subTask.unsubscribe();
    }
    if(this.save){
      this.save.unsubscribe();
    }
  }
}
