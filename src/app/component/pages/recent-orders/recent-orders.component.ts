import { Component, OnInit } from '@angular/core';
import { PasoService } from '../../paso.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-orders',
  imports: [CommonModule],
  templateUrl: './recent-orders.component.html',
})
export class RecentOrdersComponent implements OnInit {
  orders: any[] = [];
  expandedOrder: number | null = null;

  constructor(private pasoService: PasoService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.pasoService.getOrdersInProgress().subscribe(
      async (data: any) => {
        console.log('Pedidos en progreso:', data.orders);

        this.orders = await Promise.all(
          data.orders.map(async (order: any) => {
            // Procesar detalles del pedido
            const detalles = JSON.parse(order.detalles);
            const serviceFee = parseFloat(detalles.serviceFee || '0');
            const deliveryFee = parseFloat(detalles.deliveryFee || '0');
            const fees = serviceFee + deliveryFee;
            const subtotal = parseFloat(order.total) - fees;

            // Obtener el nombre del viajero
            let travelerName = 'No asignado';
            if (order.viaje_id) {
              try {
                const tripOwner = await this.pasoService
                  .getTripOwnerById(order.viaje_id)
                  .toPromise();
                  console.log('tripOwner:', tripOwner);
                if (tripOwner?.usuario_id) {
                  const user = await this.pasoService
                    .getUserNameById(tripOwner.usuario_id)
                    .toPromise();
                    console.log('user:', user);
                  travelerName = user?.usuario || 'Sin nombre';
                }
              } catch (error) {
                console.error(
                  `Error al obtener viajero para viaje ID ${order.viaje_id}:`,
                  error
                );
              }
            }

            // Obtener los nombres de los productos
            const items = await Promise.all(
              detalles.productIds.map(async (product: any) => {
                try {
                  const productDetails = await this.pasoService
                    .getProductById(product.productId)
                    .toPromise();
                    console.log('productDetails:', productDetails);
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
              ...order,
              fees,
              subtotal,
              travelerName,
              items,
            };
          })
        );
      },
      (error) => {
        console.error('Error al obtener pedidos en progreso:', error);
      }
    );
  }

  toggleDetails(orderId: number): void {
    this.expandedOrder = this.expandedOrder === orderId ? null : orderId;
  }
}
