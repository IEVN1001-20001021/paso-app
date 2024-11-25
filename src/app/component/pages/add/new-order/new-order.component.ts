import { Component, OnInit } from '@angular/core';
import { PasoService } from '../../../paso.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../navbar/navbar.component";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './new-order.component.html',
})
export class NewOrderComponent implements OnInit {
  searchTerm: string = '';
  selectedCity: string = '';
  selectedRating: string = '';
  stores: any[] = [];
  ratings: string[] = ['1', '2', '3', '4', '5'];

  constructor(private pasoService: PasoService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCity = params['city'] || '';
      this.fetchStores();
    });
  }

  fetchStores(): void {
    this.pasoService
      .getStores(this.searchTerm, this.selectedCity, this.selectedRating)
      .subscribe((stores) => {
        this.stores = stores;
      });
  }

  goToStore(storeId: string): void {
    // Lógica para redirigir a la página de detalles de la tienda
    console.log(`Redirigiendo a la tienda con ID: ${storeId}`);
    this.router.navigate(['pages/store-details', storeId]);
  }
}
