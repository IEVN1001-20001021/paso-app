import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class PasoService {
  private apiUrl1 = 'http://localhost:5000';
  private apiUrl = 'https://api-paso.onrender.com'; // Cambiar si es necesario
  private cartItems: any[] = [];
  private cartSubject: BehaviorSubject<any[]> = new BehaviorSubject(
    this.cartItems
  );
  private tripId: number | null = null; // Variable para almacenar el ID del viaje

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  /* Componente Viajes */
  registrarViaje(viajeData: any): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/registrarViaje`, viajeData, {
      headers,
    });
  }

  /* Componente Perfil */
  /** Obtiene el perfil del usuario, incluyendo tarjetas */
  getUserProfile(): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  uploadImageToImgBB(formData: FormData, name: string): Observable<any> {
    const apiKey = '1f77428e6b77f93d7174f958874e4c32';
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}&name=${name}`;

    return this.http.post(url, formData);
  }

  updateProfileImage(imageUrl: string): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(
      `${this.apiUrl}/update-profile-image`,
      { imageUrl },
      { headers }
    );
  }

  /* Componente Dashboard */
  getRecentTrips(): Observable<any> {
    return this.http.get(`${this.apiUrl}/viajes/recientes`);
  }

  getFilteredTrips(destination: string, arrivalDate: string): Observable<any> {
    const params: any = {};
    if (destination) params.destination = destination;
    if (arrivalDate) params.arrival_date = arrivalDate;

    return this.http.get(`${this.apiUrl}/viajes`, { params });
  }

  /* Componente Detalle de Viaje */
  getTripDetails(tripId: number): Observable<any> {
    const token = this.cookieService.get('authToken'); // Obtener el token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
    });

    return this.http.get(`${this.apiUrl}/viaje/detalle/${tripId}`, { headers });
  }

  /* Obtener tiendas filtradas */
  getStores(searchTerm: string, city: string, rating: string): Observable<any> {
    const params: any = {};
    if (searchTerm) params.search = searchTerm;
    if (city) params.city = city;
    if (rating) params.rating = rating;

    return this.http.get(`${this.apiUrl}/get-tiendas`, { params });
  }

  /* Componente Tienda */
  getStoreDetails(storeId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/store-details?store_id=${storeId}`
    );
  }

  getProducts(storeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products?store_id=${storeId}`);
  }

  /* Componente Carrito */
  addToCart(item: any) {
    const exist = this.cartItems.find((cartItem) => cartItem.id === item.id);
    if (exist) {
      exist.quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }
    this.cartSubject.next(this.cartItems); // Notificar cambios
  }

  getCartItems(): any[] {
    return [...this.cartItems];
  }

  cartItemsObservable(): Observable<any[]> {
    return this.cartSubject.asObservable();
  }

  /* Métodos para manejar el ID del viaje */
  setTripId(tripId: number): void {
    this.tripId = tripId;
  }

  getTripId(): number | null {
    return this.tripId;
  }

  /* Componente Billing */
  /** Guarda la información de una tarjeta nueva en el perfil del usuario */
  saveCardInfo(cardInfo: any): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // Assuming you have an API endpoint to add a card to the user's profile
    return this.http.post(`${this.apiUrl}/cards/add`, cardInfo, { headers });
  }

  deleteCard(cardId: number): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(
      `${this.apiUrl}/cards/delete/${cardId}`,
      {},
      { headers }
    );
  }

  /* Componente Ticket */
  sendOrder(orderData: any): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.apiUrl}/enviarPedido`, orderData, {
      headers,
    });
  }

  /* Componente Notificaciones */
  getPendingOrders(userId: number): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Ajuste necesario en el backend para utilizar el userId
    return this.http.get(`${this.apiUrl}/pedidos/pendientes?userId=${userId}`, {
      headers,
    });
  }

  getAcceptedOrders(userId: number): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Ajuste necesario en el backend para utilizar el userId
    return this.http.get(`${this.apiUrl}/pedidos/aceptados?userId=${userId}`, {
      headers,
    });
  }

  getRejectedOrders(userId: number): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Ajuste necesario en el backend para utilizar el userId
    return this.http.get(`${this.apiUrl}/pedidos/rechazados?userId=${userId}`, {
      headers,
    });
  }

  // Descartar una notificación
  discardNotification(orderId: number): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put(
      `${this.apiUrl}/notificaciones/descartar/${orderId}`,
      {},
      { headers }
    );
  }

  getTripOwnerById(tripId: number): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/viaje/propietario/${tripId}`, {
      headers,
    });
  }

  updateOrderState(orderId: number, state: string): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(
      `${this.apiUrl}/pedidos/${orderId}/estado`,
      { state },
      { headers }
    );
  }
  updateOrderDelivered(orderId: number, delivered: boolean): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(
      `${this.apiUrl}/pedidos/${orderId}/entregado`,
      { delivered },
      { headers }
    );
  }

  getProductById(productId: number): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/producto/${productId}`, { headers });
  }

  getUserNameById(userId: number): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/usuario/${userId}`, { headers });
  }
  /* Componente Pedidos en Progreso */
  getOrdersInProgress(): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.get(`${this.apiUrl}/pedidos/en-progreso`, { headers });
  }

  getTripsInProgress(): Observable<any> {
    const token = this.cookieService.get('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.get(`${this.apiUrl}/viajes/en-progreso`, { headers });
  }
}
