import { Component, Input, OnInit } from '@angular/core';
import { PasoService } from '../../paso.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-car',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-car.component.html',
})
export class ShopCarComponent implements OnInit {
  @Input() store: any; // Añadir la tienda como entrada
  cartItems: any[] = [];
  isCartOpen = false;

  constructor(private pasoService: PasoService, private router: Router) {}

  ngOnInit() {
    this.pasoService.cartItemsObservable().subscribe(cartItems => {
      this.cartItems = cartItems;
    });
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  proceedToCheckout() {
    console.log("Proceeding to checkout with items:", this.cartItems);
    this.router.navigate(['pages/ticket'], { state: { store: this.store } }); // Pasar la tienda al navegar
  }
}
