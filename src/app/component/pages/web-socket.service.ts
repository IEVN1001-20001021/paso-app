import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor(private socket: Socket) {}
  // Escuchar el evento de actualización de notificaciones
  listenForUpdates() {
    return this.socket.fromEvent<{ type: string; order_id: number }>(
      'notification-update'
    );
  }

  // Método opcional para emitir eventos (si es necesario desde el cliente)
  emitEvent(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
