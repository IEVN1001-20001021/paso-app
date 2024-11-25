import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../authservice.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, RouterLink],
    templateUrl: './sign-up.component.html',
    styles: []
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  calculatedAge: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      motherLastName: ['', Validators.required],
      birthdate: ['', [Validators.required, this.validateAge]],
      gender: ['', Validators.required],
    });
  }

  validateAge(control: any): { [key: string]: boolean } | null {
    const birthdate = new Date(control.value);
    const today = new Date();
    const age =
      today.getFullYear() -
      birthdate.getFullYear() -
      (today.getMonth() < birthdate.getMonth() ||
      (today.getMonth() === birthdate.getMonth() &&
        today.getDate() < birthdate.getDate())
        ? 1
        : 0);

    return age >= 18 ? null : { underage: true };
  }

  calculateAge(): void {
    const birthdate = this.signUpForm.get('birthdate')?.value;
    if (birthdate) {
      const today = new Date();
      const birthdateDate = new Date(birthdate);
      this.calculatedAge =
        today.getFullYear() -
        birthdateDate.getFullYear() -
        (today.getMonth() < birthdateDate.getMonth() ||
        (today.getMonth() === birthdateDate.getMonth() &&
          today.getDate() < birthdateDate.getDate())
          ? 1
          : 0);
    }
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      return;
    }

    if (
      this.signUpForm.get('password')?.value !==
      this.signUpForm.get('confirmPassword')?.value
    ) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Crear un objeto con los datos del formulario
    let sexoValue = this.signUpForm.get('gender')?.value;
    if (sexoValue === 'male') {
      sexoValue = 'M';
    } else if (sexoValue === 'female') {
      sexoValue = 'F';
    } else if (sexoValue === 'other') {
      sexoValue = 'O';
    }

    const formData = {
      usuario: `${this.signUpForm.get('firstName')?.value} ${
        this.signUpForm.get('lastName')?.value
      }`,
      correo: this.signUpForm.get('email')?.value,
      contraseña: this.signUpForm.get('password')?.value,
      APaterno: this.signUpForm.get('lastName')?.value,
      AMaterno: this.signUpForm.get('motherLastName')?.value,
      fecha_nacimiento: this.signUpForm.get('birthdate')?.value,
      sexo: sexoValue, // Se pasa el valor transformado
    };

    // Llamar al servicio para enviar los datos
    this.authService.register(formData).subscribe({
      next: (response: any) => {
        alert(response.message);
        this.router.navigate(['/login/methods/email']);
      },
      error: (error) => {
        alert(error.error?.error || 'Error en el servidor.');
      },
    });
  }
}
