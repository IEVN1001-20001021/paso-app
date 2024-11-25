import { CommonModule, NgIf } from '@angular/common';
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
import { jwtDecode } from 'jwt-decode';
import { NavbarComponent } from "../../../navbar/navbar.component";
import { Router } from '@angular/router';

interface JwtPayload {
  user_id: string;
}

@Component({
  selector: 'app-new-trip',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule, NavbarComponent],
  templateUrl: './new-trip.component.html',
})
export class NewTripComponent implements OnInit {
  travelForm!: FormGroup;
  coldContainers = 0;
  hotContainers = 0;

  constructor(
    private fb: FormBuilder,
    private pasoService: PasoService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.travelForm = this.fb.group({
      departureCity: ['', Validators.required],
      destination: ['', Validators.required],
      arrivalDate: ['', Validators.required],
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

  get arrivalDate() {
    return this.travelForm.get('arrivalDate');
  }

  get returnDate() {
    return this.travelForm.get('returnDate');
  }

  returnDateValidator(control: FormControl) {
    if (this.travelForm) {
      const arrivalDate = this.travelForm.get('arrivalDate')?.value;
      if (
        arrivalDate &&
        control.value &&
        new Date(control.value) < new Date(arrivalDate)
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
  
      const token = this.cookieService.get('authToken');
      if (token) {
        const user = this.decodeToken(token);
        formData.usuario = user.user_id;
      }
  
      this.pasoService
        .registrarViaje(formData)
        .pipe(
          catchError((error) => {
            console.error('Error al registrar el viaje:', error);
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response) {
            console.log('Viaje registrado:', response);
            this.router.navigate(['/pages/dashboard']);
            this.pasoService.getUserProfile().subscribe((perfil) => {
              console.log('Perfil actualizado:', perfil);
            });
          }
        });
    }
  }

  decodeToken(token: string): JwtPayload {
    return jwtDecode<JwtPayload>(token);
  }
}
