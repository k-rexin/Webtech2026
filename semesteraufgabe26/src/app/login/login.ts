import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Auth } from '../shared/auth';

interface LoginData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormField], // zur anbindung von inputfeldern/ formularen
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router); // angulars rouiter service wird hier aufgerufen umd zu einer anderen route zu navigieren
  private auth = inject(Auth);

  errorMessage = signal<string | null>(null);

  loginModel = signal<LoginData>({ username: '', password: '' });

// schemaPath beschreibt Pfad zu bestimmten Feld in Datenstruktur, spiegelt Struktur des Modells wider, für fehlerfreie/typsichere Validierungen & Bindungen
  loginForm = form(this.loginModel, (schemaPath) => { //hier wird loginForm durch formfield ein objekt das fuer jedes inputfeld ein .unterobjekt erstellt
    required(schemaPath.username, { message: 'Usernamen eingeben' });
    required(schemaPath.password, { message: 'Passwort eingeben' });
  });

  onSubmit(event: Event) { // event um aus ausgabe auf die konsole zu haben
    event.preventDefault();
    // hier login logik
    const credentials = this.loginModel();
    this.auth.login(credentials.username, credentials.password).subscribe({
      next: () => {
        this.router.navigate(['/profil']);
      },
      error: (err) => {
        console.log('Login-Fehler:', err);
        this.errorMessage.set('Username oder Passwort falsch');
      }
    });
  }

}
