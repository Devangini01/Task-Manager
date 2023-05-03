import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User,UserRes } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private user1: User ;
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    //This will be used for registration
    registration(username: string, password: string, firstname: string, lastname: string, mobile: string, address: string, email: string, isActive: true){
      let options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };
      let params = {'firstname' : firstname ,
      'lastname' : lastname,
      'username': username ,
      'password': password,
      'mobile':  mobile,
      'address' : address,
      'email' : email,
      'isActive' : isActive,
      }
      return this.http.post<any>(`${environment.apiUrl}/api/saveUser`, params )
          .pipe(map(user=> {
              if(user.success){
                  this.user1 = {
                        username: user.data.username,
                        password: password,
                        id: user.data._id,
                        firstname: user.data.firstname ,
                        mobile: user.data.mobile,
                        address: user.data.address,
                        email: user.data.email,
                        lastname: user.data.lastname,
                        isAdmin: user.data.isAdmin,
                        isActive: user.data.isActive,
                        authdata: user.token,/*window.btoa(user.data.username + ':' + password)*/
                    };
                    //localStorage.setItem('user', JSON.stringify(this.user1));
//                     this.userSubject.next(this.user1);
                    return user;
                }else{
                    return user ;
                }
          }))
    }

    login(username: string, password: string) {

//       let headers = new HttpHeaders();
//       headers = headers.append('Content-Type','application/json');

      let options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };
      let params = {'username' : username , 'password' : password }


      return this.http.post<any>(`${environment.apiUrl}/api/login`, params )
      //return this.http.get<any>(`${environment.apiUrl}/session/token` )
        .pipe(map(user => {

                // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
                //user.authdata = window.btoa(username + ':' + password);
                //console.log()
                if(user.success){
                    this.user1 = {
                        username: user.data.username,
                        password: password,
                        id : user.data._id ,
                        firstname: user.data.firstname ,
                        lastname: user.data.lastname,
                        address: user.data.address,
                        mobile: user.data.mobile,
                        email: user.data.email,
                        isAdmin: user.data.isAdmin,
                        isActive: user.data.isActive,
                        //csrf_token: user.csrf_token,
                        //logout_token: user.logout_token ,
                        //profileUrl: user.current_user.profileUrl,
                        authdata:user.token,
                    };

                    console.log(this.user1);
                    localStorage.setItem('user', JSON.stringify(this.user1));
                    this.userSubject.next(this.user1);
                    return user;
                }else{
                    return user ;
                }
            }));
    }

  getUsers(): Observable<UserRes> {
    return this.http.get<UserRes>(`${environment.apiUrl}/api/getUsers`)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<UserRes>('getUsers'))
    );
  }

  deleteUser(id:string): Observable <UserRes>{
    return this.http.delete<UserRes>(`${environment.apiUrl}/api/deleteUser/${id}`,this.httpOptions)
      .pipe(
        tap(_=> {}),
        catchError(this.handleError<UserRes>('deleteUser'))
      );
  }
  getSingleUser(id : string): Observable<UserRes> {
    return this.http.get<UserRes>(`${environment.apiUrl}/api/getSingleUser/${id}`,this.httpOptions )
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<UserRes>('getSingleUser'))
    );
  }
  
  getUserData(): Observable<UserRes> {
    return this.http.get<UserRes>(`${environment.apiUrl}/api/getUserData`,this.httpOptions )
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<UserRes>('getUserData'))
    );
  }

  updateUser(ob:User):Observable <UserRes>{
    console.log(ob);
    return this.http.put<UserRes>(`${environment.apiUrl}/api/updateUser/${ob.id}`,{'id':ob.id,'username':ob.username,'firstname':ob.firstname,'lastname':ob.lastname,'mobile':ob.mobile,'address':ob.address,'email':ob.email, 'isActive': ob.isActive },this.httpOptions)
    .pipe(
      tap(_=> {}),
      catchError(this.handleError<UserRes>('updateUser'))
    );
  }

  updatePermission(ob):Observable <UserRes>{
    return this.http.put<UserRes>(`${environment.apiUrl}/api/updatePermission`,ob,this.httpOptions)
    .pipe(
      tap(_=> {}),
      catchError(this.handleError<UserRes>('updatePermission'))
    );
  }
  
  changePassword(ob):Observable <UserRes>{
    return this.http.put<UserRes>(`${environment.apiUrl}/api/changePassword/:id`,{'id':ob.id, 'password': ob.password},this.httpOptions)
    .pipe(
      tap(_=> {}),
      catchError(this.handleError<UserRes>('changePassword'))
    );
  }
  
  

    logout() {
        //TODO need to work out on closing of session
      localStorage.removeItem('user');
      this.userSubject.next(null);
      this.router.navigate(['/login']);
      console.log('logout');
    }

    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

}
