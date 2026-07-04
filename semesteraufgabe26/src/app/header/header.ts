import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../shared/auth';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
private router = inject(Router); // angulars rouiter service wird hier aufgerufen umd zu einer anderen route zu navigieren
  private auth = inject(Auth);

  onClick() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

}
