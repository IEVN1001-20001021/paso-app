import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { routes } from './app.routes';

// Configuración de Socket.IO
const socketIoConfig: SocketIoConfig = {
  url: 'http://localhost:5000', // Cambia esta URL a tu servidor
  options: {
    transports: ['websocket'], // Opcional: usar WebSocket puro
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: Socket,
      useFactory: () => new Socket(socketIoConfig), // Provisión manual de Socket
    },
  ],
};
