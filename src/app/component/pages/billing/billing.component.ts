import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PasoService } from '../../paso.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing.component.html',
})
export class BillingComponent implements OnInit {
  showForm = false;
  cardName: string = '';
  cardNumber: string = '';
  expiryDate: string = '';
  cvc: string = '';
  cards: any[] = [];
  selectedCard: any = null;

  @Output() selectedCardChange = new EventEmitter<any>();

  constructor(private pasoService: PasoService, private router: Router) {}

  ngOnInit(): void {
    this.pasoService.getUserProfile().subscribe(
      (profile) => {
        this.cards = profile.cards || [];
        if (this.cards.length > 0) {
          this.selectedCard = this.cards[0];
          this.selectedCardChange.emit(this.selectedCard); // Emit to ensure cardId is handled
        }
      },
      (error) => {
        console.error('Error obteniendo perfil:', error);
      }
    );
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.resetForm();
    }
  }

  saveCard() {
    const cardInfo = {
      cardName: this.cardName,
      cardNumber: this.cardNumber,
      expiryDate: this.expiryDate,
      cvc: this.cvc,
    };

    console.log('Guardando tarjeta:', cardInfo);

    this.pasoService.saveCardInfo(cardInfo).subscribe(() => {
      // Vuelve a cargar las tarjetas del backend
      this.pasoService.getUserProfile().subscribe((profile) => {
        this.cards = profile.cards || [];

        // Selecciona automáticamente la última tarjeta añadida
        this.selectedCard = this.cards[this.cards.length - 1];

        // Emitir el evento para notificar el cambio
        if (this.selectedCard) {
          this.selectedCardChange.emit(this.selectedCard);
        }

        // Oculta el formulario
        this.showForm = false;
      });
    });
  }

  resetForm() {
    this.cardName = '';
    this.cardNumber = '';
    this.expiryDate = '';
    this.cvc = '';
  }

  formatExpiryDate(value: string): string {
    if (value.length === 2 && !value.includes('/')) {
      return value + '/';
    }
    return value;
  }

  formatCardNumber(value: string): string {
    return value.replace(/\D/g, '').slice(0, 16);
  }

  formatCVC(value: string): string {
    return value.replace(/\D/g, '').slice(0, 3);
  }

  getCardIcon(cardNumber: string): string {
    const visaRegex = /^4[0-9]{5}/;
    const masterCardRegex = /^5[1-5][0-9]{4}/;

    if (visaRegex.test(cardNumber)) {
      return 'fab fa-cc-visa text-blue-600';
    } else if (masterCardRegex.test(cardNumber)) {
      return 'fab fa-cc-mastercard text-red-600';
    }
    return 'fas fa-credit-card';
  }
  setSelectedCard(card: any) {
    this.selectedCard = card;
    this.selectedCardChange.emit(card);
  }
}
