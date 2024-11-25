import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { PasoService } from '../../paso.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NavbarComponent } from '../../navbar/navbar.component';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  notificationCountPendientes: number = 0;
  notificationCountAceptados: number = 0;
  notificationCountRechazados: number = 0;
  notificationsPendientes: any[] = [];
  notificationsAceptados: any[] = [];
  notificationsRechazados: any[] = [];
  notifications: any[] = [];
  pendingOrders: any[] = [];
  acceptedOrders: any[] = [];
  rejectedOrders: any[] = [];
  notificationCount: number = 0;
  isLoading: boolean = false;

  constructor(
    private pasoService: PasoService,
    private cookieService: CookieService,
    private ngZone: NgZone,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.notificationService.notificationCount$.subscribe((count) => {
      this.notificationCount = count;
    });
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    const authToken = this.cookieService.get('authToken');
    if (!authToken) {
      console.error('Usuario no autenticado. El token no está presente.');
      return;
    }

    this.isLoading = true;

    // Obtener el perfil del usuario
    this.pasoService.getUserProfile().subscribe({
      next: (perfil) => {
        const usuarioIdSesion = perfil.id;

        // Obtener pedidos por separado
        this.getPendingOrders(usuarioIdSesion).subscribe({
          next: (pendientes) => {
            console.log('pendientes', pendientes);
            this.pendingOrders = pendientes;
            if (pendientes.length === 0) {
              this.isLoading = false;
            } else {
              this.fetchNotificationsByOrderType(
                pendientes,
                'pendientes',
                usuarioIdSesion
              );
            }
          },
          error: (err) => {
            console.error('Error al obtener pedidos pendientes:', err);
            this.isLoading = false;
          },
        });

        this.getAcceptedOrders(usuarioIdSesion).subscribe({
          next: (aceptados) => {
            console.log('aceptados', aceptados);
            this.acceptedOrders = aceptados;
            if (aceptados.length === 0) {
              this.isLoading = false;
            } else {
              this.fetchNotificationsByOrderType(
                aceptados,
                'aceptados',
                usuarioIdSesion
              );
            }
          },
          error: (err) => {
            console.error('Error al obtener pedidos aceptados:', err);
            this.isLoading = false;
          },
        });

        this.getRejectedOrders(usuarioIdSesion).subscribe({
          next: (rechazados) => {
            console.log('rechazados', rechazados);
            this.rejectedOrders = rechazados;
            if (rechazados.length === 0) {
              this.isLoading = false;
            } else {
              this.fetchNotificationsByOrderType(
                rechazados,
                'rechazados',
                usuarioIdSesion
              );
            }
          },
          error: (err) => {
            console.error('Error al obtener pedidos rechazados:', err);
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error al obtener perfil del usuario:', err);
        this.isLoading = false;
      },
    });
  }

  fetchNotificationsByOrderType(
    orders: any[],
    state: string,
    usuarioIdSesion: number
  ): void {
    const notificationsObservables = orders.map((order: any) =>
      this.processOrder(order, usuarioIdSesion)
    );

    forkJoin(notificationsObservables).subscribe({
      next: (notifications) => {
        this.ngZone.run(() => {
          // Filtrar las notificaciones válidas y actualizarlas
          const validNotifications = Array.isArray(notifications)
            ? notifications.filter((n) => n !== null)
            : [];

          // Asignar las notificaciones procesadas a las variables correctas
          if (state === 'pendientes') {
            this.pendingOrders = validNotifications;
          } else if (state === 'aceptados') {
            this.acceptedOrders = validNotifications;
          } else if (state === 'rechazados') {
            this.rejectedOrders = validNotifications;
          }

          // Actualizar el conteo de notificaciones en el servicio
          this.notificationService.updateNotificationCount(
            this.notificationCount
          );
          this.isLoading = false;
        });
      },
      error: (err) => {
        console.error(`Error al procesar pedidos ${state}:`, err);
        this.isLoading = false;
      },
    });
  }

  // Función para obtener órdenes pendientes
  getPendingOrders(usuarioIdSesion: number): Observable<any[]> {
    return this.pasoService.getPendingOrders(usuarioIdSesion).pipe(
      map((response: any) => response.orders || []),
      catchError((err) => {
        console.error('Error al obtener pedidos pendientes:', err);
        return of([]);
      })
    );
  }

  // Función para obtener órdenes aceptadas
  getAcceptedOrders(usuarioIdSesion: number): Observable<any[]> {
    return this.pasoService.getAcceptedOrders(usuarioIdSesion).pipe(
      map((response: any) => response.orders || []),
      catchError((err) => {
        console.error('Error al obtener pedidos aceptados:', err);
        return of([]);
      })
    );
  }

  // Función para obtener órdenes rechazadas
  getRejectedOrders(usuarioIdSesion: number): Observable<any[]> {
    return this.pasoService.getRejectedOrders(usuarioIdSesion).pipe(
      map((response: any) => response.orders || []),
      catchError((err) => {
        console.error('Error al obtener pedidos rechazados:', err);
        return of([]);
      })
    );
  }

  processOrder(order: any, userId: number): Observable<any> {
    let details;
    try {
      details = JSON.parse(order.detalles);
    } catch (err) {
      console.error('Error al parsear detalles:', order.detalles, err);
      return of(null);
    }

    const productRequests = details.productIds.map((product: any) =>
      this.pasoService.getProductById(product.productId).pipe(
        map((productData) => ({
          name: productData.nombre,
          quantity: product.quantity,
        }))
      )
    );

    const userRequest = this.pasoService.getUserNameById(order.usuario_id);

    return forkJoin([...productRequests, userRequest] as const).pipe(
      map((results: any[]) => {
        const products = results.slice(0, -1);
        const orderOwnerName = results[results.length - 1].usuario;

        return {
          id: order.id,
          products,
          total: order.total,
          userName: orderOwnerName,
          state: order.estado,
          notification: order.notificacion,
        };
      }),
      catchError((err) => {
        console.error('Error al procesar el pedido:', err);
        return of(null); // Retornar null para pedidos fallidos
      })
    );
  }

  handleAccept(orderId: number): void {
    this.pasoService.updateOrderState(orderId, 'Aceptado').subscribe(() => {
      this.refreshNotifications();
    });
  }

  handleReject(orderId: number): void {
    this.pasoService.updateOrderState(orderId, 'Rechazado').subscribe(() => {
      this.refreshNotifications();
    });
  }

  refreshNotifications(): void {
    this.notifications = [];
    this.notificationCount = 0;
    this.fetchNotifications();
  }

  discardNotification(orderId: number): void {
    this.pasoService.discardNotification(orderId).subscribe({
      next: () => {
        // Encuentra y elimina la notificación en las listas correspondientes
        this.pendingOrders = this.pendingOrders.filter((n) => n.id !== orderId);
        this.acceptedOrders = this.acceptedOrders.filter(
          (n) => n.id !== orderId
        );
        this.rejectedOrders = this.rejectedOrders.filter(
          (n) => n.id !== orderId
        );

        // Actualiza la lista de notificaciones global
        this.notifications = [
          ...this.pendingOrders,
          ...this.acceptedOrders,
          ...this.rejectedOrders,
        ];

        // Actualiza el contador de notificaciones
        this.notificationCount = this.notifications.length;
        this.notificationService.updateNotificationCount(
          this.notificationCount
        );

        console.log(`Notificación con ID ${orderId} descartada con éxito`);
      },
      error: (err) => {
        console.error('Error al descartar la notificación:', err);
      },
    });
  }

  trackByFn(index: number, item: any): any {
    return item.id; // Clave única para cada notificación
  }
}
