import { Injectable, signal } from '@angular/core';

export interface Item {
    id: string;
    name: string;
    beschreibung :string;
    anzahl: string;
    mhd: string;
    ort: string;
}

@Injectable({
  providedIn: 'root'
}) 
export class ItemService {
    private allItems = signal<Record<string,Item[]>>({}); // speichert fuer jede tablle ihre eigene Liste von Items
    //  pro tabelle ein Array damit sie sich bei mehreren Schubladen nicht ueberschreiben

    getItems(tableId: string) { //gibt items fuer bestimmte tabelle zurueck
        return this.allItems()[tableId] ?? []; // wenn noch keine items (??) dann leere liste [] anstelle von fehler
    }

    addItem(tableId: string, item: Omit<Item, 'id'>) { // fuegt ein neues item hinzu
        const newItem: Item = {
            ...item,  //uebernimmt uebergebene daten und fuegt random id hinzu
            id: crypto.randomUUID(),
        };
        this.allItems.update(all => { // updated array
            const previousItems = all[tableId] ?? []; //gibt bisherige liste von diesem table zurueck & falls zu id noch nicht existiert dann leeres array[] 
            return { ...all, [tableId]: [...previousItems, newItem] }; // ...all kopiert alle anderen tabelle unveraendert rueber 
            // dann ausgewaehlte tabelle mit neuem item zusammengebaut 
        });
    } 
    //Signals erkennen aenderungen nur, wenn man komplett neues Objekt/Array zurueckgibt nicht wenn das bestehende einfach veraendert wird (mit push())


    updateItems(tableId: string, items: Item[]) { // ist fuer drag&drop wichtig fuer neue reihenfolge
        this.allItems.update(all => ({ ...all, [tableId]: items })); //alle tabellen wie vorher nur eine tabelle komplett neu mit Item[] ersetzten
    }


}
