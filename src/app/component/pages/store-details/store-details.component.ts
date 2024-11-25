import { Component, OnInit } from '@angular/core';
import { PasoService } from '../../paso.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopCarComponent } from '../shop-car/shop-car.component';

@Component({
  selector: 'app-store-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ShopCarComponent],
  templateUrl: './store-details.component.html',
})
export class StoreDetailsComponent implements OnInit {
  store: any;
  products: any[] = [];
  filteredProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private pasoService: PasoService
  ) {}

  ngOnInit() {
    const storeId = this.route.snapshot.paramMap.get('id');

    if (storeId) {
      this.pasoService
        .getStoreDetails(storeId)
        .subscribe((data) => (this.store = data));
      this.pasoService.getProducts(storeId).subscribe((data) => {
        this.products = data.map((product) => ({ ...product, quantity: 1 }));
        this.filteredProducts = [...this.products];
      });
    }
  }

  addToCart(product: any) {
    if (product.quantity > 0) {
      console.log('Adding product to cart:', product);
      this.pasoService.addToCart({ ...product, storeId: this.store.id });
      // Puedes agregar aquí una animación visual de confirmación
    } else {
      console.warn('Quantity must be greater than 0');
    }
  }
}
