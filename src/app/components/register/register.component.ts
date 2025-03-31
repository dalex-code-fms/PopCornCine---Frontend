import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { RegisterCredentials } from 'src/app/model/registerCredentials.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  message: string = '';
  credentials: RegisterCredentials = new RegisterCredentials(
    '',
    '',
    '',
    '',
    0,
    '',
    '',
    ''
  );
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      age: ['', [Validators.required]],
      phone: [
        '',
        [Validators.required, Validators.pattern('^(?:\\+33|0)[1-9]\\d{8}$')],
      ],
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
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.message = "Le formulaire n'est pas valide.";
      return;
    }

    this.credentials.email = this.registerForm.value.email;
    this.credentials.password = this.registerForm.value.password;
    this.credentials.age = this.registerForm.value.age;
    this.credentials.firstName = this.registerForm.value.firstName;
    this.credentials.lastName = this.registerForm.value.lastName;
    this.credentials.phone = this.registerForm.value.phone;

    this.authService.register(this.credentials).subscribe({
      next: (response) => {
        if (response.token) {
          this.authService.saveTokenIntoLocalStorage(response.token);
          this.router.navigate(['/home']);
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
