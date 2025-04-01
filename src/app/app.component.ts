import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontend';
  loggedIn = false;
  photoUrl: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((isLoggedIn) => {
      this.loggedIn = isLoggedIn;
    });
    this.authService.photoUrl$.subscribe((photoUrl) => {
      this.photoUrl = photoUrl;
    });
  }

  logout(): void {
    this.authService.logOut();
    this.loggedIn = false;
  }
}
