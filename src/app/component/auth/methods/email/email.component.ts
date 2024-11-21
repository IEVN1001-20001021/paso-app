import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../authservice.service';
import { NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './email.component.html',
  styles: [],
})
export class EmailComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.authService.login(loginData).subscribe(
        (response) => {
          console.log('Login exitoso', response);
          this.router.navigate(['/pages/dashboard']);
        },
        (error) => {
          console.error('Error al iniciar sesión', error);
        }
      );
    }
  }
}
