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
  private photoUrlSubject = new BehaviorSubject<string | null>(null);
  loggedIn$ = this.loggedInSubject.asObservable();
  photoUrl$ = this.photoUrlSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadInitialPhotoUrl();
  }

  login(credentials: LoginCredentials) {
    return this.apiService.getUserByEmail(credentials);
  }

  saveTokenIntoLocalStorage(token: string): void {
    localStorage.setItem('token', token);
    this.loggedInSubject.next(true);
    this.loadInitialPhotoUrl();
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
    this.loggedInSubject.next(false);
    this.photoUrlSubject.next(null);
  }

  register(credentials: RegisterCredentials) {
    return this.apiService.saveUser(credentials);
  }

  private loadInitialPhotoUrl(): void {
    if (this.isLoggedIn()) {
      this.apiService.getUserProfile().subscribe({
        next: (user) => {
          const photoUrl = user.photoUrl
            ? `http://localhost:8080${user.photoUrl}`
            : null;
          this.photoUrlSubject.next(photoUrl);
        },
        error: () => {
          this.photoUrlSubject.next(null);
        },
      });
    }
  }

  updatePhotoUrl(photoUrl: string | null): void {
    this.photoUrlSubject.next(photoUrl);
  }
}
