import { Injectable } from '@angular/core';
import { HttpClient , HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { PartyRes, Party } from '@app/_models';
import { TransactionRes, Transaction} from '@app/_models';
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
	//Accounts

  getAccounts(): Observable<PartyRes> {
    return this.http.get<PartyRes>(`${environment.apiUrl}/api/getAccounts`)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<PartyRes>('getAccounts'))
    );
  }

  saveAccount(name:string,contact_no:string, isActive:boolean): Observable<PartyRes> {
  let params = {'name' : name ,
    'contact_no' : contact_no,
    'isActive': isActive ,
    }
  return this.http.post<PartyRes>(`${environment.apiUrl}/api/saveAccount`, params, this.httpOptions)
    .pipe(
      tap(_ => {}),
      catchError(this.handleError<PartyRes>('saveAccount'))
    );
  }

  deleteAccounts(id:string): Observable <PartyRes>{
    return this.http.delete<PartyRes>(`${environment.apiUrl}/api/deleteAccounts/${id}`,this.httpOptions)
      .pipe(
        tap(_=> {}),
        catchError(this.handleError<PartyRes>('deleteAccounts'))
      );
  }

  updateAccount(ob : Party): Observable <PartyRes>{
    return this.http.put<PartyRes>(`${environment.apiUrl}/api/updateAccount`,{'id':ob.id,'name':ob.partyName,'contact_no':ob.contact,'isActive':ob.isActive},this.httpOptions)
    .pipe(
      tap(_=> {}),
      catchError(this.handleError<PartyRes>('updateAccount'))
    );
  }

  getSingleAccount(id : string): Observable<PartyRes> {
    return this.http.get<PartyRes>(`${environment.apiUrl}/api/getSingleAccount/${id}`,this.httpOptions )
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<PartyRes>('getSingleAccount'))
    );
  }

  getAccountData(): Observable<PartyRes> {
    return this.http.get<PartyRes>(`${environment.apiUrl}/api/getAccountData`)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<PartyRes>('getAccountData'))
    );
  }

  //Transaction

  deleteTransaction(id:string): Observable <TransactionRes>{
    return this.http.delete<TransactionRes>(`${environment.apiUrl}/api/deleteTransaction/${id}`,this.httpOptions)
      .pipe(
        tap(_=> {}),
        catchError(this.handleError<TransactionRes>('deleteTransaction'))
      );
  }

  getTransaction(date: string): Observable<TransactionRes> {
    return this.http.get<TransactionRes>(`${environment.apiUrl}/api/getTransaction/${date}`,this.httpOptions)
    .pipe(
      tap(_ =>{}),
      catchError(this.handleError<TransactionRes>('getTransaction'))
    );
  }

  getSingleTransaction(id : string): Observable<TransactionRes> {
    return this.http.get<TransactionRes>(`${environment.apiUrl}/api/getSingleTransaction/${id}`,this.httpOptions )
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<TransactionRes>('getSingleTransaction'))
    );
  }

  getUnapprovedTransaction(): Observable<TransactionRes> {
    return this.http.get<TransactionRes>(`${environment.apiUrl}/api/getUnapprovedTransaction`)
    .pipe(
      tap(_ =>{}),
      catchError(this.handleError<TransactionRes>('getUnapprovedTransaction'))
    );
  }

  approveTransaction(id:string):Observable <TransactionRes>{
    return this.http.put<any>(`${environment.apiUrl}/api/approveTransaction/`,{'id':id },this.httpOptions)
    .pipe(
      tap(_=> {}),
      catchError(this.handleError<TransactionRes>('approveTransaction'))
    );
  }

  getTransactionByDate(date : string): Observable<TransactionRes> {
    return this.http.get<TransactionRes>(`${environment.apiUrl}/api/getTransactionByDate/${date}`,this.httpOptions )
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<TransactionRes>('getTransactionByDate'))
      );
  }

  getOpenBalance(date: string): Observable<TransactionRes> {
  return this.http.get<TransactionRes>(`${environment.apiUrl}/api/getOpenBalance/${date}`)
    .pipe(
      tap(_ =>{}),
      catchError(this.handleError<TransactionRes>('getOpenBalance'))
  );
  }

  getTransactionByAccount(id : string): Observable<TransactionRes> {
    return this.http.get<TransactionRes>(`${environment.apiUrl}/api/getTransactionByAccount/${id}`,this.httpOptions )
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<TransactionRes>('getTransactionByAccount'))
      );
  }


  //Payment

  savePayment(obj:Transaction): Observable<TransactionRes> {
    return this.http.post<TransactionRes>(`${environment.apiUrl}/api/savePayment`, obj, this.httpOptions)
      .pipe(
        tap(_ => {}),
        catchError(this.handleError<TransactionRes>('savePayment'))
      );
  }

  updatePayment(ob:Transaction):Observable <TransactionRes>{
    return this.http.put<TransactionRes>(`${environment.apiUrl}/api/updatePayment/:id`,{'id':ob.id,'date':ob.date,'account':ob.account,'name':ob.name,'narration':ob.narration,'amount':ob.amount,'paymentType':ob.paymentType,'transactionBy':ob.transactionBy },this.httpOptions)
    .pipe(
      tap(_=> {}),
      catchError(this.handleError<TransactionRes>('updatePayment'))
    );
  }

  getSinglePayment(id : string): Observable<TransactionRes> {
    return this.http.get<TransactionRes>(`${environment.apiUrl}/api/getSinglePayment/${id}`,this.httpOptions )
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<TransactionRes>('getSingleReceipt'))
      );
  }

  //Receipts

  saveReceipt(obj:Transaction): Observable<TransactionRes> {
    return this.http.post<TransactionRes>(`${environment.apiUrl}/api/saveReceipt`, obj, this.httpOptions)
      .pipe(
        tap(_ => {}),
        catchError(this.handleError<TransactionRes>('savePayment'))
      );
  }

  getSingleReceipt(id : string): Observable<TransactionRes> {
    return this.http.get<TransactionRes>(`${environment.apiUrl}/api/getSingleReceipt/${id}`,this.httpOptions )
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<TransactionRes>('getSingleReceipt'))
    );
  }

  updateReceipt(ob:Transaction):Observable <TransactionRes>{
    return this.http.put<TransactionRes>(`${environment.apiUrl}/api/updateReceipt/:id`,{'id':ob.id,'date':ob.date,'account':ob.account,'name':ob.name,'narration':ob.narration,'amount':ob.amount,'paymentType':ob.paymentType,'transactionBy':ob.transactionBy },this.httpOptions)
    .pipe(
      tap(_=> {}),
      catchError(this.handleError<TransactionRes>('updatePayment'))
    );
  }

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

    /*


    //Attendance

    getAttendance(): Observable <any>{
      return this.http.get(`${environment.apiUrl}/api/getAttendance`);
    }

    saveAttendance(data): Observable <any>{
      console.log(data);
      return this.http.post(`${environment.apiUrl}/api/saveAttendance`,data);
    }

    updateAttendance(data): Observable <any>{
      return this.http.put(`${environment.apiUrl}/api/updateAttendance`,data);
    }


    deleteAttendance(data): Observable <any>{
      console.log(data);
      return this.http.post(`${environment.apiUrl}/api/deleteAttendance`,data);
    }

    //Employee

    getEmployee(): Observable <any>{
      return this.http.get(`${environment.apiUrl}/api/getEmployee`);
    }

    saveEmployee(data): Observable <any>{
      console.log(data);
      return this.http.post(`${environment.apiUrl}/api/saveEmployee`,data);
    }

    updateEmployee(data): Observable <any>{
      return this.http.put(`${environment.apiUrl}/api/updateEmployee`,data);
    }


    deleteEmployee(data): Observable <any>{
      console.log(data);
      return this.http.post(`${environment.apiUrl}/api/deleteEmployee`,data);
    }

    //Permission

     getPermission(): Observable <any>{
      return this.http.get(`${environment.apiUrl}/api/getPermission`);
    }

    savePermission(data): Observable <any>{
      console.log(data);
      return this.http.post(`${environment.apiUrl}/api/savePermission`,data);
    }

    updatePermission(data): Observable <any>{
      return this.http.put(`${environment.apiUrl}/api/updatePermission`,data);
    }


    deletePermission(data): Observable <any>{
      console.log(data);
      return this.http.post(`${environment.apiUrl}/api/deletePermission`,data);
    }

    */


}
