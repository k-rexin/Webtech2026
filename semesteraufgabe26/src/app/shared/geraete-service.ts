import { Injectable, signal } from '@angular/core';

export interface Geraet {
  id: string;
  name: string;
  geraetTyp: string;
  anzahlSchubladen: string;
}

@Injectable({providedIn: 'root'}) // durch root kann der service von allen komponenten innerhalb root genutz werden
export class GeraeteService {
 geraete = signal<Geraet[]>([]); // ist signal mit array-liste stat einzelnem objekt fuer alle angelegten geraete

 addGeraet(geraet: Omit<Geraet, 'id'>) { 
    // id wird nicht im modal-formular eingegeben deswegen wird es durch Omit beim aufruf nciht gefordert und kann hier hunzugefuegt werden
    const neuesGeraet: Geraet = {
        ...geraet,
        id: crypto.randomUUID(), // erzeugt eine random& eindeutige ID fuer url
    };
    this.geraete.update(liste => [...liste, neuesGeraet]); 
    // ...liste kopiert alle bisherigen elemente von geraete[] und neues element wird drangehangen
 }


}
