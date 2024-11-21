import { CommonModule, NgIf } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { PasoService } from '../../../paso.service';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-new-trip',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './new-trip.component.html',
})
export class NewTripComponent implements OnInit {
  travelForm!: FormGroup;
  coldContainers = 0;
  hotContainers = 0;

  constructor(
    private fb: FormBuilder,
    private pasoService: PasoService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.travelForm = this.fb.group({
      departureCity: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
      returnDate: [
        '',
        [Validators.required, this.returnDateValidator.bind(this)],
      ],
      coldContainers: [this.coldContainers, Validators.min(0)],
      hotContainers: [this.hotContainers, Validators.min(0)],
      comments: [''],
    });
  }

  get departureCity() {
    return this.travelForm.get('departureCity');
  }

  get destination() {
    return this.travelForm.get('destination');
  }

  get departureDate() {
    return this.travelForm.get('departureDate');
  }

  get returnDate() {
    return this.travelForm.get('returnDate');
  }

  returnDateValidator(control: FormControl) {
    if (this.travelForm) {
      const departureDate = this.travelForm.get('departureDate')?.value;
      if (
        departureDate &&
        control.value &&
        new Date(control.value) < new Date(departureDate)
      ) {
        return { invalidReturnDate: true };
      }
    }
    return null;
  }

  updateCount(type: string, change: number): void {
    if (type === 'cold') {
      this.coldContainers = Math.max(0, this.coldContainers + change);
      this.travelForm.patchValue({ coldContainers: this.coldContainers });
    } else if (type === 'hot') {
      this.hotContainers = Math.max(0, this.hotContainers + change);
      this.travelForm.patchValue({ hotContainers: this.hotContainers });
    }
  }

  onSubmit(): void {
    if (this.travelForm.valid) {
      const formData = { ...this.travelForm.value };

      // Obtener el token de la cookie y extraer el usuario
      const token = this.cookieService.get('authToken');
      if (token) {
        const user = this.decodeToken(token); // Asume que tienes una función decodeToken
        formData.usuario = user.user_id; // Cambié 'id' por 'user_id' para que coincida con el nombre en el token
      }

      // Enviar los datos del formulario y registrar el viaje
      this.pasoService
        .registrarViaje(formData)
        .pipe(
          catchError((error) => {
            console.error('Error al registrar el viaje:', error);
            return of(null); // Maneja el error de manera segura
          })
        )
        .subscribe((response) => {
          if (response) {
            console.log('Viaje registrado:', response);
          }
        });
    }
  }

  decodeToken(token: string) {
    // Usando jwt-decode (asegúrate de instalar esta librería en tu proyecto)
    const jwtDecode = require('jwt-decode');
    return jwtDecode(token);
  }
}
