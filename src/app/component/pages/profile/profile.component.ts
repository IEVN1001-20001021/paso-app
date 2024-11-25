import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { PasoService } from '../../paso.service';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { RecentOrdersComponent } from "../recent-orders/recent-orders.component";
import { AdminCardsComponent } from "../admin-cards/admin-cards.component";
import { RecentTripsComponent } from "../recent-trips/recent-trips.component"; // Importamos ChangeDetectorRef

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent, NgIf, RecentOrdersComponent, AdminCardsComponent, RecentTripsComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  loadingImage: boolean = false;

  constructor(
    private pasoService: PasoService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.pasoService.getUserProfile().subscribe(
      (profile) => {
        console.log('Perfil recibido:', profile);
        this.userProfile = profile;
      },
      (error) => {
        console.error('Error al cargar el perfil del usuario', error);
      }
    );
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.loadingImage = true; // Mostrar indicador de carga

      const userName = this.userProfile.username || 'default_name';

      const formData = new FormData();
      formData.append('image', file);

      this.pasoService.uploadImageToImgBB(formData, userName).subscribe(
        (response: any) => {
          console.log('Respuesta completa de ImgBB:', response);

          if (response && response.data && response.data.url) {
            const imageUrl = response.data.url;

            console.log('URL que se va a enviar al backend:', imageUrl);
            this.pasoService.updateProfileImage(imageUrl).subscribe(
              () => {
                this.userProfile.image_url = imageUrl; // Usa el campo correcto
                this.cd.detectChanges(); // Forzar detección de cambios
                this.loadingImage = false;
                alert('Imagen actualizada exitosamente.');
                console.log('Imagen actualizada:', imageUrl);
              },
              (error) => {
                console.error(
                  'Error al actualizar la imagen en el backend:',
                  error
                );
                this.loadingImage = false;
              }
            );
          } else {
            console.error('Error: No se recibió la URL de la imagen correcta.');
            this.loadingImage = false;
          }
        },
        (error) => {
          console.error('Error al subir la imagen a ImgBB:', error);
          this.loadingImage = false;
        }
      );
    }
  }

  editProfile() {
    alert('Funcionalidad de edición de perfil en construcción.');
  }

  viewTravelSummary() {
    alert('Funcionalidad de resumen de viajes en construcción.');
  }

  viewOrderSummary() {
    alert('Funcionalidad de resumen de pedidos en construcción.');
  }
}
