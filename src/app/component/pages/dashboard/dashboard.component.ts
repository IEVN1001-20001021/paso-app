import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PasoService } from '../../paso.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  cities: string[] = [
    'León',
    'Guanajuato',
    'Irapuato',
    'Celaya',
    'San Miguel de Allende',
  ];
  selectedCity: string = '';
  selectedDate: string = '';
  trips: any[] = [];

  constructor(private pasoService: PasoService, private router: Router) {}

  ngOnInit(): void {
    this.loadRecentTrips();
  }

  loadRecentTrips(): void {
    this.pasoService.getRecentTrips().subscribe(
      (data: any) => {
        console.log('Viajes más recientes:', data);
        this.trips = data.trips.map((trip: any) => ({
          ...trip,
          fecha_salida: new Date(trip.fecha_salida).toISOString(),  // Convierte a Date
          fecha_regreso: new Date(trip.fecha_regreso).toISOString(),  // Convierte a Date
        }));
      },
      (error) => {
        console.error('Error al cargar los viajes más recientes:', error);
      }
    );
  }

  searchTrips(): void {
    if (!this.selectedCity && !this.selectedDate) {
      return;
    }

    this.pasoService
      .getFilteredTrips(this.selectedCity, this.selectedDate)
      .subscribe(
        (data: any) => {
          this.trips = data.trips;
        },
        (error) => {
          console.error('Error al buscar viajes:', error);
        }
      );
  }

  viewDetails(tripId: number): void {
    this.pasoService.setTripId(tripId); // Almacenar el ID del viaje en el servicio
    this.router.navigate(['pages/viajes/detalle', tripId]);
  }
}
