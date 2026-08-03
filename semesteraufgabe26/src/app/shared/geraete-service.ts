import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Auth } from './auth';

export interface Geraet {
  id: string;
  name: string;
  geraetTyp: string;
  anzahlSchubladen: string;
}

@Injectable({
  providedIn: 'root'
}) // durch root kann der service von allen komponenten innerhalb root genutz werden

export class GeraeteService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private baseUrl = 'http://localhost:3000/geraete';
  
  //wird von navbar abgefragt und durchgegangen
  geraete = signal<Geraet[]>([]); // ist signal mit array-liste stat einzelnem objekt fuer alle angelegten geraete


  private getHeaders(): HttpHeaders {
    const headers = this.auth.getAuthHeaders();
    return new HttpHeaders(headers);
  }

  loadGeraete(): void { //laedt liste der geraete aus backend und packt sie ins signal, muss jetzt aufgerufen werden
    this.http.get<any[]>(this.baseUrl, { headers: this.getHeaders() }).subscribe({
      next: (response) => { //.map uebersetzt _id aus DB zu id
        const mapped = response.map(g => ({ id: g._id, name: g.name, geraetTyp: g.geraetTyp, anzahlSchubladen: g.anzahlSchubladen }));
        this.geraete.set(mapped);
      },
      error: (err) => console.log('Fehler beim Laden der Geräte:', err)
    });
  }

  addGeraet(geraet: Omit<Geraet, 'id'>): Observable<any> {
    return this.http.post(this.baseUrl, geraet, { headers: this.getHeaders() }).pipe(
      tap(() => this.loadGeraete())
    );
  }

  updateGeraet(id: string, changes: Partial<Omit<Geraet, 'id'>>): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, changes, { headers: this.getHeaders() }).pipe(
      tap(() => this.loadGeraete())
    );
  }

  deleteGeraet(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      tap(() => this.loadGeraete())
    );
  }
 // mit pipe(tap) nach jedem update/delete/add Liste neu geladen, damit Signal wieder aktuell ist
}
