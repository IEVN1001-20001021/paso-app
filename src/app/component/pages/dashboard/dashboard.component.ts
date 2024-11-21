import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, NavbarComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  cities: string[] = ['León', 'Guanajuato', 'Irapuato', 'Celaya', 'San Miguel de Allende'];
  selectedCity: string = '';
  selectedDate: string = '';
  trips: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  searchTrips() {
    if (!this.selectedCity || !this.selectedDate) {
      alert('Por favor, selecciona una ciudad y una fecha.');
      return;
    }

    const url = `http://localhost:5000/api/get_trips?city=${encodeURIComponent(this.selectedCity)}&date=${encodeURIComponent(this.selectedDate)}`;
    this.http.get<any[]>(url).subscribe(
      data => {
        this.trips = data;
        if (this.trips.length === 0) {
          alert('No hay viajes disponibles para la fecha seleccionada.');
        }
      },
      error => {
        console.error('Error al obtener los viajes:', error);
      }
    );
  }
}
