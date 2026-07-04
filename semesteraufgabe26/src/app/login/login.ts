import { Component, inject, signal } from '@angular/core';
import { form, required, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Auth } from '../shared/auth';

interface LoginData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router); // angulars rouiter service wird hier aufgerufen umd zu einer anderen route zu navigieren
  private auth = inject(Auth);

  loginModel = signal<LoginData>({
    username: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Usernamen eingeben' });
    required(schemaPath.password, { message: 'Passwort eingeben' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    // hier login logik
    const credentials = this.loginModel();
    console.log('Einloggen mit: ', credentials);
    //auth.Service.login(credentials); ??
    this.auth.login();
    this.router.navigate(['/profil']); // route zum profil (ist ein bsp. auf angulars webseite zu dependency injection)

  }

}

/*readonly #auth = inject(AuthService);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected async login(email: string, password: string) {
    this.isLoading.set(true);
    try {
      await this.#auth.login(email, password);
      await this.router.navigate([...]);
    } catch (e) {
      this.error.set(e.message);
    }
    this.isLoading.set(false);
  }
    */