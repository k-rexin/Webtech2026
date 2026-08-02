import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthUser {
  id: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';

  user = signal<AuthUser | null>(null);
  token = signal<string | null>(null);

  isAuthenticated = computed(() => this.token() !== null); // gilt als eingeloggt wenn es token gibt 

  getAuthHeaders() { // hilfsfunktion um jedem request den richtigen header (autorisierung-token, username) mitzuschicken
    return {
      authorization: this.token() ?? '',
      username: this.user()?.username ?? ''
    };
  }

  register(username: string, password: string): Observable<any> { // username und password von aufrufender komponente mitgegeben
    // HttpClient gibt bei post() immer ein observable zurueck , any = strucktur der backend-antwort ist noch nciht klar 
    return this.http.post(`${this.baseUrl}/users/register`, { username, password });
    //sendet post-request zusammengebaute URL , username und password werden im body mitgeschcikt
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/login`, { username, password }).pipe( // mit pipe weitere operationen ans observable dran
      tap((response: any) => {  // tap von RxJS nutzt response um zusaetzlich folgendes auszufuehren
        this.token.set(response.token); // token und user werden aus backend dem signal uebergeben
        this.user.set(response.user);
      })
    );
  }

  logout(): void {
    this.user.set(null);
    this.token.set(null);
  }

  deleteAccount(): Observable<any> { // userdaten werden geloesch, danach logout
    const headers = new HttpHeaders(this.getAuthHeaders());
    return this.http.delete(`${this.baseUrl}/users/me`, { headers }).pipe(
      tap(() => this.logout())
    );
  }


}
