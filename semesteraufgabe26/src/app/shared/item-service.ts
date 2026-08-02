import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Auth } from './auth';

export interface Item {
    id: string;
    name: string;
    beschreibung: string;
    anzahl: string;
    mhd: string;
    ort: string;
    geraetId: string;
    schubladeIndex: number | null;
    reihenfolge: number;
}

export interface ItemFormData {
    name: string;
    beschreibung: string;
    anzahl: string;
    mhd: string;
}

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    private http = inject(HttpClient);
    private auth = inject(Auth);
    private baseUrl = 'http://localhost:3000/items';

    // Speichert Items gruppiert nach ihrer tableId 
    private itemsMap = signal<Record<string, Item[]>>({});

    private getHeaders(): HttpHeaders {
        return new HttpHeaders(this.auth.getAuthHeaders());
    }

    private buildKey(geraetId: string, schubladeIndex: number | null): string {
        return schubladeIndex !== null ? `${geraetId}-schublade-${schubladeIndex}` : geraetId;
    }

    getItems(tableId: string) { //gibt items fuer bestimmte tabelle zurueck
        return this.itemsMap()[tableId] ?? []; // wenn noch keine items (??) dann leere liste [] anstelle von fehler
    }

    // Laedt ALLE Items eines Geraets (alle Schubladen auf einmal) und verteilt sie in itemsMap
    loadItems(geraetId: string): void {
        this.http.get<any[]>(`${this.baseUrl}/geraet/${geraetId}`, { headers: this.getHeaders() }).subscribe({
            next: (response) => {
                const mapped: Item[] = response.map(i => ({
                    id: i._id,
                    name: i.name,
                    beschreibung: i.beschreibung,
                    anzahl: i.anzahl,
                    mhd: i.mhd,
                    ort: i.ort,
                    geraetId: i.geraetId,
                    schubladeIndex: i.schubladeIndex ?? null,
                    reihenfolge: i.reihenfolge ?? 0
                }));

                this.itemsMap.update(map => {
                    const updated = { ...map };
                    // alle bisherigen Eintraege zu diesem geraetId loeschen (werden neu aufgebaut)
                    for (const key of Object.keys(updated)) {
                        if (key === geraetId || key.startsWith(`${geraetId}-schublade-`)) {
                            delete updated[key];
                        }
                    }
                    // neu einsortieren
                    for (const item of mapped) {
                        const key = this.buildKey(item.geraetId, item.schubladeIndex);
                        updated[key] = [...(updated[key] ?? []), item];
                    }
                    return updated;
                });
            },
            error: (err) => console.log('Fehler beim Laden der Items:', err)
        });
    }

    addItem(geraetId: string, schubladeIndex: number | null, daten: ItemFormData & { ort: string }): Observable<any> {
        const body = { ...daten, geraetId, schubladeIndex };

        return this.http.post(this.baseUrl, body, { headers: this.getHeaders() }).pipe(
            tap(() => this.loadItems(geraetId))
        );
    }

    updateItem(id: string, geraetId: string, daten: Partial<ItemFormData & { ort: string }>): Observable<any> {
        return this.http.patch(`${this.baseUrl}/${id}`, daten, { headers: this.getHeaders() }).pipe(
            tap(() => this.loadItems(geraetId))
        );
    }

    deleteItem(id: string, geraetId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() }).pipe(
            tap(() => this.loadItems(geraetId))
        );
    }

    reorderItems(geraetId: string, updates: { id: string; ort: string; schubladeIndex: number | null; reihenfolge: number }[]): Observable<any> {
        return this.http.patch(`${this.baseUrl}/reorder`, { updates }, { headers: this.getHeaders() }).pipe(
            tap(() => this.loadItems(geraetId))
        );
    }


}
