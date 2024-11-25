import { Component, OnInit } from '@angular/core';
import { PasoService } from '../../paso.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-trips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-trips.component.html',
})
export class RecentTripsComponent implements OnInit {
  trips: any[] = [];
  expandedTrip: number | null = null;

  constructor(private pasoService: PasoService) {}

  ngOnInit(): void {
    this.fetchTrips();
  }

  fetchTrips() {
    this.pasoService.getTripsInProgress().subscribe(
      async (data: any) => {
        this.trips = await Promise.all(
          data.orders
            .filter(
              (order: any) => order.estado === 'Aceptado' && !order.entregado
            )
            .map(async (trip: any) => {
              const detalles = JSON.parse(trip.detalles);
              const serviceFee = parseFloat(detalles.serviceFee || '0');
              const deliveryFee = parseFloat(detalles.deliveryFee || '0');
              const fees = serviceFee + deliveryFee;
              const subtotal = parseFloat(trip.total) - fees;

              let userName = 'No asignado';
              if (trip.usuario_id) {
                try {
                  const user = await this.pasoService
                    .getUserNameById(trip.usuario_id)
                    .toPromise();
                  userName = user?.usuario || 'Sin nombre';
                } catch (error) {
                  console.error(
                    `Error al obtener usuario para ID ${trip.usuario_id}:`,
                    error
                  );
                }
              }

              const items = await Promise.all(
                detalles.productIds.map(async (product: any) => {
                  try {
                    const productDetails = await this.pasoService
                      .getProductById(product.productId)
                      .toPromise();
                    return {
                      name: productDetails?.nombre || 'Producto desconocido',
                      quantity: product.quantity,
                      cost:
                        parseFloat(productDetails?.price || '0') *
                        product.quantity,
                    };
                  } catch (error) {
                    console.error(
                      `Error al obtener detalles del producto ID ${product.productId}:`,
                      error
                    );
                    return {
                      name: 'Error al cargar producto',
                      quantity: product.quantity,
                      cost: 0,
                    };
                  }
                })
              );

              return {
                ...trip,
                fees,
                subtotal,
                userName,
                items,
              };
            })
        );
      },
      (error) => {
        console.error('Error al obtener viajes asignados:', error);
      }
    );
  }

  toggleDetails(tripId: number): void {
    this.expandedTrip = this.expandedTrip === tripId ? null : tripId;
  }

  markAsDelivered(tripId: number): void {
    this.pasoService.updateOrderDelivered(tripId, true).subscribe(
      () => {
        const trip = this.trips.find((t) => t.id === tripId);
        if (trip) {
          trip.delivered = true;
        }
        console.log(`Viaje ID ${tripId} marcado como entregado.`);
      },
      (error) => {
        console.error(
          `Error al marcar viaje ID ${tripId} como entregado:`,
          error
        );
      }
    );
  }
}
