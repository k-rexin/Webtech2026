import { Component, computed, inject, input, signal } from '@angular/core';
import { ItemService, Item, ItemFormData } from '../../../shared/item-service';
import { TitleCasePipe } from '@angular/common';
import { CdkDropList, CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { ItemModal } from '../item-modal/item-modal';

type Position = 'links' | 'mitte' | 'rechts';

@Component({
  selector: 'app-geraete-table',
  imports: [ItemModal, TitleCasePipe, CdkDropList, CdkDrag, CdkDragHandle, CdkDropListGroup],
  templateUrl: './geraete-table.html',
  styleUrl: './geraete-table.css',
})
export class GeraeteTable {
  private itemService = inject(ItemService);

  // id der tabelle von geraeteComponent uebergeben
  tableId = input.required<string>();

  // liest passende items aus dem service aus
  items = computed(() => this.itemService.getItems(this.tableId()));
  // computed berechnet sich automatisch bei aenderung von tableId oder daten im service

  positionen: Position[] = ['links', 'mitte', 'rechts'];

  itemOnPosition(position: Position) { //gibt items fuer eine bestimmte Position/ort wieder
    return computed(() =>
      this.items().filter(i => i.ort.endsWith(position))
    );
  }

  drop(event: CdkDragDrop<Item[]>) {
    const allItems = [...this.items()];

    //innerhalb selber position verschoben
    if (event.previousContainer === event.container) //sind funktionen von cdk, aus welchem container kommt item, in welchen container geht es
    {
      const positionItems = [...event.container.data];
      moveItemInArray(positionItems, event.previousIndex, event.currentIndex);
      // neue reihenfolge innerhalb position in gesamtliste einbauen
      const otherItems = allItems.filter(i => !positionItems.some(p => p.id === i.id));
      const updated = [...otherItems, ...positionItems];

      this.itemService.updateItems(this.tableId(), updated);
      return;
    }

    //item in andere positon geschoben
    const movedItem = event.previousContainer.data[event.previousIndex]; //index auch von cdk 
    const newPosition = event.container.id as Position; // id sind positionen zum direkten ablesen wo item ist
    const newOrt = `${this.tableId()} ${newPosition}`;

    const updated = allItems.map(i =>
      i.id === movedItem.id ? { ...i, ort: newOrt } : i
    );

    this.itemService.updateItems(this.tableId(), updated);
  }

  deleteItem(item: Item) {
    const alleItems = this.itemService.getItems(this.tableId());
    const gefiltert = alleItems.filter(i => i.id !== item.id);
    this.itemService.updateItems(this.tableId(), gefiltert);
  }

  modalOpenPosition = signal<Position | null>(null); //merkt sich fuer welche position modal offen ist (fuer Ort eintrag) (null = geschlossen)
  editingItemId = signal<string | null>(null);
  filledInData = signal<ItemFormData | null>(null); // wird an modal weitergeleitet

  openModal(position: Position) {
    this.editingItemId.set(null);
    this.filledInData.set(null);
    this.modalOpenPosition.set(position);
  }

  editItem(item: Item) {
    this.editingItemId.set(item.id);
    this.filledInData.set({
      name: item.name,
      beschreibung: item.beschreibung,
      anzahl: item.anzahl,
      mhd: item.mhd,
    });
    // Position für das Modal aus dem vorhandenen ort ableiten
    const position = this.positionen.find(p => item.ort.endsWith(p));
    this.modalOpenPosition.set(position ?? null);
  }

  onModalSaved(data: ItemFormData) { // reagiert auf saved-output von modal
    const position = this.modalOpenPosition();
    if (!position) return;

    const ort = `${this.tableId()} ${position}`;
    const editId = this.editingItemId();

    if (editId) {
      const allItems = this.itemService.getItems(this.tableId());
      const updated = allItems.map(i =>
        i.id === editId ? { ...i, ...data, ort } : i
      );
      this.itemService.updateItems(this.tableId(), updated);
    } else {
      this.itemService.addItem(this.tableId(), { ...data, ort });
    }

    this.modalOpenPosition.set(null);
    this.editingItemId.set(null);
  }

  onModalCancelled() { //reagiert auf cancelled-output von modal
    this.modalOpenPosition.set(null);
    this.editingItemId.set(null);
  }

}
