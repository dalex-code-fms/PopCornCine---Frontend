import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginCredentials } from '../model/loginCredentials.model';
import { Observable } from 'rxjs';
import { RegisterCredentials } from '../model/registerCredentials.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  public getUserByEmail(credentials: LoginCredentials): Observable<any> {
    return this.http.post<any>(environment.host + '/users/login', credentials);
  }

  public saveUser(credentials: RegisterCredentials): Observable<any> {
    return this.http.post<any>(
      environment.host + '/users/register',
      credentials
    );
  }
}
