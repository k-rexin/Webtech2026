import { Component, inject } from '@angular/core';
import { GeraeteService } from '../shared/geraete-service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive], //um aktivelinks (also da wo ich gerade bin) anders anzuzeigen in navbar
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  geraeteService = inject(GeraeteService);
}
