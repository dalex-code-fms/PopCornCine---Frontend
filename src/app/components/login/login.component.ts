import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginCredentials } from 'src/app/model/loginCredentials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message: string = '';
  credentials: LoginCredentials = new LoginCredentials('', '');

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          ),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.message = "Le formulaire n'est pas valide.";
      return;
    }

    this.credentials.email = this.loginForm.value.email;
    this.credentials.password = this.loginForm.value.password;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response.token) {
          this.authService.saveTokenIntoLocalStorage(response.token);
          this.router.navigate(['']);
        } else if (response.message) {
          this.message = response.message;
        }
      },
      error: (err) => {
        if (err.error && err.error.error) {
          this.message = err.error.error;
        }
      },
    });
  }
}
