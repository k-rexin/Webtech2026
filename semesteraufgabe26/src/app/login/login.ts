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
  successMessage = signal<string | null>(null);

  loginModel = signal<LoginData>({ username: '', password: '' });

  // schemaPath beschreibt Pfad zu bestimmten Feld in Datenstruktur, spiegelt Struktur des Modells wider, für fehlerfreie/typsichere Validierungen & Bindungen
  loginForm = form(this.loginModel, (schemaPath) => { //hier wird loginForm durch formfield ein objekt das fuer jedes inputfeld ein .unterobjekt erstellt
    required(schemaPath.username, { message: 'Usernamen eingeben' });
    required(schemaPath.password, { message: 'Passwort eingeben' });
  });

  onLogin(event: Event) {
    event.preventDefault();
    if (this.loginForm().invalid()) return;
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

  onRegister() { // zur registrierung 
    if (this.loginForm().invalid()) {
      return;
    }
    const credentials = this.loginModel();
    this.errorMessage.set(null);

    this.auth.register(credentials.username, credentials.password).subscribe({
      next: () => {
        this.successMessage.set('Sie haben sich erfolgreich registriert und können sich jetzt einloggen!');
        this.resetForm(); //leert nach erfolgreicher registrierung das formular
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Registrierung fehlgeschlagen');
      }
    });
  }

  resetForm() {
    this.loginModel.set({ username: '', password: '' });
  }

}
