import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  profileForm!: FormGroup;
  message: string = '';
  currentPhotoUrl: string | null = null;
  selectedFile: File | null = null;
  userFullName: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      phone: [
        '',
        [Validators.required, Validators.pattern('^(?:\\+33|0)[1-9]\\d{8}$')],
      ],
      description: [''],
    });

    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.message = 'Vous devez être connecté pour voir votre profil.';
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.getUserProfile().subscribe({
      next: (user) => {
        console.log(user.photoUrl);

        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          phone: user.phone,
          description: user.description || '',
        });
        this.currentPhotoUrl = user.photoUrl
          ? `http://localhost:8080${user.photoUrl}`
          : null;
        this.authService.updatePhotoUrl(this.currentPhotoUrl);
        this.userFullName = `${user.lastName} ${user.firstName}`.toUpperCase();
      },
      error: (err) => {
        this.message = 'Erreur lors du chargement du profil.';
        this.router.navigate(['/login']);
      },
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => (this.currentPhotoUrl = e.target.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.message = 'Veuillez corriger les erreurs dans le formulaire.';
      return;
    }

    const formData = new FormData();
    formData.append(
      'user',
      new Blob([JSON.stringify(this.profileForm.value)], {
        type: 'application/json',
      })
    );
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.apiService.updateUserProfile(formData).subscribe({
      next: () => {
        this.message = 'Profil mis à jour avec succès !';
        this.profileForm.markAsPristine();
        this.selectedFile = null;
        this.loadUserProfile();
      },
      error: (err) => {
        this.message =
          err.error?.error || 'Erreur lors de la mise à jour du profil.';
        console.error(err);
      },
    });
  }
}
