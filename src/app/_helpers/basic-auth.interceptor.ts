import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor , HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add header with basic auth credentials if user is logged in and request is to the api url
        const user = this.authenticationService.userValue;
        const isLoggedIn = user && user.authdata;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                //withCredentials: true,
                setHeaders: {
                  Authorization: `Bearer ${user.authdata}`,
                  //'X-CSRF-Token':  `${user.csrf_token}`,
                  'Content-Type': 'application/json'
                },
                //mode: 'no-cors' // the most important option
            });
        }else{
          request = request.clone({
            setHeaders: {
              'Content-Type': 'application/json'
            }
          });
        }

        return next.handle(request);
    }
}
