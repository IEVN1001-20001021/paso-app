import { Component, OnInit } from '@angular/core';
import { PasoService } from '../../paso.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-cards',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-cards.component.html',
})
export class AdminCardsComponent implements OnInit {
  cards: any[] = [];
  selectedCard: number | null = null; // Índice de la tarjeta seleccionada

  constructor(private pasoService: PasoService) {}

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.pasoService.getUserProfile().subscribe(
      (profile) => {
        this.cards = profile.cards || [];
      },
      (error) => {
        console.error('Error al obtener tarjetas:', error);
      }
    );
  }

  toggleCardDetails(index: number): void {
    this.selectedCard = this.selectedCard === index ? null : index;
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

  deleteCard(card: any): void {
    if (confirm(`¿Estás seguro de eliminar la tarjeta terminada en ${card.numero_enmascarado.slice(-4)}?`)) {
      this.pasoService.deleteCard(card.id).subscribe(
        () => {
          this.cards = this.cards.filter((c) => c.id !== card.id);
          alert('Tarjeta eliminada exitosamente.');
        },
        (error) => {
          console.error('Error al eliminar la tarjeta:', error);
          alert('No se pudo eliminar la tarjeta.');
        }
      );
    }
  }
}
