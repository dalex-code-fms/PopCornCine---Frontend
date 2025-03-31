import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LoginCredentials } from '../model/loginCredentials.model';
import { RegisterCredentials } from '../model/registerCredentials.model';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private apiService: ApiService) {}

  login(credentials: LoginCredentials) {
    return this.apiService.getUserByEmail(credentials);
  }

  saveTokenIntoLocalStorage(token: string): void {
    localStorage.setItem('token', token);
    this.loggedInSubject.next(true);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token ? this.isTokenValid(token) : false;
  }

  private isTokenValid(token: string): boolean {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp ? decodedToken.exp > currentTime : false;
    } catch (error) {
      return false;
    }
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.loggedInSubject.next(true);
  }

  register(credentials: RegisterCredentials) {
    return this.apiService.saveUser(credentials);
  }
}
