import { Injectable, signal } from '@angular/core';

export interface Item {
    id: string;
    name: string;
    beschreibung :string;
    anzahl: string;
    mhd: string;
    ort: string;
}

@Injectable()
export class ItemService {
    private allItems = signal<Record<string,Item[]>>({}); // speichert fuer jede tablle ihre eigene Liste von Items, pro tabelle ein Array (fuer verschiedene Schubladen)

    getItems(tableId: string) {
        return this.allItems()[tableId] ?? []; //gibt items fuer bestimmte tabelle zurueck
    }

    addItem(tableId: string, item: Omit<Item, 'id'>) {
        const newItem: Item = {
            ...item,
            id: crypto.randomUUID(),
        };
        this.allItems.update(all => {
            const previousItems = all[tableId] ?? [];
            return { ...all, [tableId]: [...previousItems, newItem] };
        });
    }

    updateItems(tableId: string, items: Item[]) {
        this.allItems.update(all => ({ ...all, [tableId]: items }));
    }


}
