import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class PasoService {
  private apiUrl = 'http://localhost:5000';
  constructor(private http: HttpClient, private cookieService: CookieService) {}
  registrarViaje(viajeData: any): Observable<any> {
    const token = this.cookieService.get('authToken'); // Obtener el token de la cookie

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Enviar el token como un encabezado de autorización
    });

    return this.http.post(`${this.apiUrl}/registrarViaje`, viajeData, {
      headers,
    });
  }
}
