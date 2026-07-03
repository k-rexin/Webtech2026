import { Component, signal } from '@angular/core';
import { form, required, FormField } from '@angular/forms/signals';
import { NgOptimizedImage } from "@angular/common";

interface LoginData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormField, NgOptimizedImage],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginModel = signal<LoginData>({
    username: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Usernamen eingeben'});
    required(schemaPath.password, {message: 'Passwort eingeben'});
  });

  onSubmit(event: Event) {
    event.preventDefault();
    // hier login logik
    const credentials = this.loginModel();
    console.log('Einloggen mit: ', credentials);
    //auth.Service.login(credentials); ??
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