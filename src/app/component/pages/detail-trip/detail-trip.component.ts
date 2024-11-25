import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasoService } from '../../paso.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-detail-trip',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './detail-trip.component.html',
})
export class DetailTripComponent implements OnInit {
  tripId: number = 0;
  tripDetails: any = {};
  driverProfile: any = {};

  constructor(
    private route: ActivatedRoute,
    private pasoService: PasoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tripId = this.pasoService.getTripId() || 0; // Obtener el ID del viaje desde el servicio
    this.loadTripDetails();
  }

  loadTripDetails(): void {
    this.pasoService.getTripDetails(this.tripId).subscribe(
      (data: any) => {
        console.log('Detalles del viaje:', data);
        this.tripDetails = data;
        this.driverProfile = data.conductor;
      },
      (error) => {
        console.error('Error al cargar los detalles del viaje:', error);
      }
    );
  }

  makeOrder(): void {
    // Redireccionar a NewOrder con la ciudad de destino
    this.router.navigate(['pages/new-order'], {
      queryParams: { city: this.tripDetails.ciudad_destino },
    });
  }
}
