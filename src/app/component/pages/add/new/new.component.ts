import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from "../../../navbar/navbar.component";

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [RouterLink, NavbarComponent],
  templateUrl: './new.component.html'
})
export class NewComponent {

}
