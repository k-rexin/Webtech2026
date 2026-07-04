import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
    isAuthenticated = signal(false);

    login(){
        this.isAuthenticated.set(true);
    }

    // falls ich logout button mache dann hier logout(){ set(false)}

}
