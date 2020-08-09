import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { User, FireBase } from '../../../shared/interfaces';
import { Observable, throwError, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';

@Injectable({providedIn: 'root'})

export class AuthService {

  public error$: Subject<string> = new Subject<string>()

  get token(): string {
    return localStorage.getItem('blog-token');
  }

  constructor(
    private http: HttpClient
  ) {

  }

  login(user: User): Observable<any> {
    return this.http.post(`${environment.host}/login`, user)
      .pipe(tap(this.setToken));
  }

  // login(user: User): Observable<any> {
  //   return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
  //     .pipe(
  //       tap(this.setToken),
  //       catchError(this.handleError.bind(this))
  //     );
  // }


  logout() {
    this.setToken(null);
  }

  isAuth(): boolean {
    return !!this.token;
  }

  handleError(err: HttpErrorResponse) {
    const {message} = err.error.error;
    console.log(message);
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email не найден');
        break;
      case 'INVALID_EMAIL':
        this.error$.next('Неверный email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль');
        break;
    }
    return throwError(err);
  }

  // private setToken(response: FireBase | null) {
  //   if (response) {
  //     const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
  //     localStorage.setItem('fire-token', response.idToken);
  //     localStorage.setItem('fire-token-exp', expDate.toString());
  //   } else {
  //     localStorage.clear();
  //   }
  // }

  private setToken(response: any) {
    console.log('token resp = ', response);
    if (response) {
      localStorage.setItem('blog-token', response.token);
    } else {
      localStorage.clear();
    }
  }

}
