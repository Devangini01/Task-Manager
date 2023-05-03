import { Injectable } from '@angular/core';
import { HttpClient , HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

import { Task, TaskRes} from '@app/_models';
import { AddTask, AddTaskRes} from '@app/_models';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

	constructor(private http: HttpClient, private router: Router) { }
	
  //Tasks

  saveTask(obj:Task): Observable<TaskRes> {
  console.log(obj);
  return this.http.post<TaskRes>(`${environment.apiUrl}/api/saveTask`, obj, this.httpOptions)
    .pipe(
      tap(_ => {}),
      catchError(this.handleError<TaskRes>('saveTask'))
    );
  }
  getTasks(taskBy : string): Observable<TaskRes> {
    return this.http.get<TaskRes>(`${environment.apiUrl}/api/getTasks/${taskBy}`,this.httpOptions )
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<TaskRes>('getTasks'))
      );
  }

  getAllTasks(): Observable<TaskRes> {
    return this.http.get<TaskRes>(`${environment.apiUrl}/api/getAllTasks`,this.httpOptions )
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<TaskRes>('getAllTasks'))
      );
  }

  deleteTask(id:string): Observable <TaskRes>{
    return this.http.delete<TaskRes>(`${environment.apiUrl}/api/deleteTask/${id}`,this.httpOptions)
      .pipe(
        tap(_=> {}),
        catchError(this.handleError<TaskRes>('deleteTask'))
      );
  }
  
  //AddTask
  
  saveAddTask(obj:AddTask): Observable<AddTaskRes> {
  console.log(obj);
  return this.http.post<AddTaskRes>(`${environment.apiUrl}/api/saveAddTask`, obj, this.httpOptions)
    .pipe(
      tap(_ => {}),
      catchError(this.handleError<AddTaskRes>('saveAddTask'))
    );
  }
  
  getAllAddTasks(): Observable<AddTaskRes> {
    return this.http.get<AddTaskRes>(`${environment.apiUrl}/api/getAllAddTasks`,this.httpOptions )
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<AddTaskRes>('getAllAddTasks'))
      );
  }
  
  deleteAddTask(id:string): Observable <AddTaskRes>{
    return this.http.delete<AddTaskRes>(`${environment.apiUrl}/api/deleteAddTask/${id}`,this.httpOptions)
      .pipe(
        tap(_=> {}),
        catchError(this.handleError<AddTaskRes>('deleteAddTask'))
      );
  }
  
  getTaskByUser(obj:any): Observable<any> {
  console.log(obj);
  return this.http.post<any>(`${environment.apiUrl}/api/getTaskByUser`, obj, this.httpOptions)
    .pipe(
      tap(_ => {}),
      catchError(this.handleError<any>('getTaskByUser'))
    );
  }
  

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      //: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      //  better job of transforming error for user consumption


      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
