import { Component, OnInit, ViewChild } from '@angular/core';
import { PasoService } from '../../paso.service';
import { BillingComponent } from '../billing/billing.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, BillingComponent],
  templateUrl: './ticket.component.html',
})
export class TicketComponent implements OnInit {
  tripDetails: any = {};
  driverProfile: any = {};
  cartItems: any[] = [];
  store: any = {};
  user: any = {};
  serviceFee: number = 0;
  deliveryFee: number = 0;
  total: number = 0;
  selectedCard: any = null;
  cards: any[] = [];
  profile: any = {};

  constructor(private pasoService: PasoService, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadCartItems();
    this.loadTripDetails();
  }

  loadProfile() {
    this.pasoService.getUserProfile().subscribe(
      (profile) => {
        console.log('Perfil del usuario:', profile);
        this.profile = profile;
        this.cards = profile.cards || [];
        if (this.cards.length > 0) {
          this.selectedCard = this.cards[0]; // Assign default card
        }
      },
      (error) => {
        console.error('Error obteniendo perfil:', error);
      }
    );
  }

  loadCartItems() {
    this.cartItems = this.pasoService.getCartItems();
  }

  loadTripDetails() {
    const tripId = this.pasoService.getTripId();
    if (tripId) {
      this.pasoService.getTripDetails(tripId).subscribe(
        (data) => {
          this.tripDetails = data;
          this.driverProfile = data.conductor;
          this.store = history.state.store || {};
          this.calculateFees();
        },
        (error) => {
          console.error('Error al cargar los detalles del viaje:', error);
        }
      );
    }
  }

  onSelectedCardChange(card: any) {
    this.selectedCard = card;
  }

  calculateFees() {
    const subtotal = this.cartItems.reduce(
      (acc, item) => acc + item.precio_publico * item.quantity,
      0
    );
    this.serviceFee = 0.05 * subtotal;
    this.deliveryFee = 0.15 * subtotal;
    this.total = subtotal + this.serviceFee + this.deliveryFee;
  }

  sendOrder() {
    if (!this.profile.user_id || !this.cards || this.cards.length === 0) {
      console.error(
        'No se encontró el usuario o no hay tarjetas disponibles para el pago.'
      );
      return;
    }

    if (!this.selectedCard) {
      console.error('No se ha seleccionado una tarjeta.');
      return;
    }

    const tripId = this.tripDetails.id || null;
    // Asegúrate de que this.selectedCard.id es accesible y correcto
    const cardId = this.selectedCard.id;

    const productIds = this.cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const orderData = {
      userId: this.profile.user_id,
      storeId: this.store.id || null,
      tripId: tripId,
      cardId: cardId, // Use the cardId retrieved from this.selectedCard
      total: this.total.toFixed(2),
      details: JSON.stringify({
        productIds,
        serviceFee: this.serviceFee.toFixed(2),
        deliveryFee: this.deliveryFee.toFixed(2),
      }),
      state: "En Proceso",  
    };

    console.log('Enviando el siguiente pedido al backend:', orderData);

    this.pasoService.sendOrder(orderData).subscribe(
      (response) => {
        console.log('Pedido enviado exitosamente', response);
        this.router.navigate(['/pages/dashboard'], { state: { order: response } });
      },
      (error) => {
        console.error('Error al enviar el pedido', error);
      }
    );
  }
}
