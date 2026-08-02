import { Component, computed, inject, input, signal, effect } from '@angular/core';
import { ItemService, Item, ItemFormData } from '../../../shared/item-service';
import { TitleCasePipe } from '@angular/common';
import { CdkDropList, CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { ItemModal } from '../item-modal/item-modal';

type Position = 'links' | 'mitte' | 'rechts';

@Component({
  selector: 'app-geraete-table',
  imports: [TitleCasePipe, CdkDropList, CdkDrag, CdkDragHandle, CdkDropListGroup, ItemModal],
  templateUrl: './geraete-table.html',
  styleUrl: './geraete-table.css',
})
export class GeraeteTable {
  private itemService = inject(ItemService);

  // vob geraeteComponent uebergeben und aufgeteilt 
  geraetId = input.required<string>();
  schubladeIndex = input<number | null>(null);


  private tableIdKey = computed(() =>
    this.schubladeIndex() !== null ? `${this.geraetId()}-schublade-${this.schubladeIndex()}` : this.geraetId()
  );
  // computed berechnet sich automatisch bei aenderung von tableId oder daten im service

  items = computed(() => this.itemService.getItems(this.tableIdKey()));
  
  positionen: Position[] = ['links', 'mitte', 'rechts'];

  constructor() {// laedt inhalt neu sobald sich tableId aendert
    effect(() => {
      this.itemService.loadItems(this.geraetId());
    });
  }

  itemOnPosition(position: Position) { //gibt items fuer eine bestimmte Position/ort wieder
    return computed(() =>
      this.items()
        .filter(i => i.ort === position)
        .sort((a, b) => a.reihenfolge - b.reihenfolge)
    );
  }

  drop(event: CdkDragDrop<Item[]>) { // drag&drop magic
    if (event.previousContainer === event.container) {
      // Innerhalb derselben Position umsortieren
      const positionItems = [...event.container.data];
      moveItemInArray(positionItems, event.previousIndex, event.currentIndex);

      // Neue Reihenfolge für ALLE Items dieser Position ans Backend senden
      const updates = positionItems.map((item, index) => ({
        id: item.id,
        ort: item.ort,
        schubladeIndex: item.schubladeIndex,
        reihenfolge: index
      }));

      this.itemService.reorderItems(this.geraetId(), updates).subscribe({
        error: (err) => console.log('Fehler beim Umsortieren:', err)
      });
      return;
    }

    // Item in andere Position geschoben
    const movedItem = event.previousContainer.data[event.previousIndex];
    const newPosition = event.container.id as Position;
    const zielListe = [...event.container.data];

    // Item wird ans Ende der Zielspalte gehängt
    const updates = [
      { id: movedItem.id, ort: newPosition, schubladeIndex: movedItem.schubladeIndex, reihenfolge: zielListe.length },
      ...zielListe.map((item, index) => ({
        id: item.id,
        ort: item.ort,
        schubladeIndex: item.schubladeIndex,
        reihenfolge: index
      }))
    ];

    this.itemService.reorderItems(this.geraetId(), updates).subscribe({
      error: (err) => console.log('Fehler beim Verschieben:', err)
    });
  }

  deleteItem(item: Item) {
    this.itemService.deleteItem(item.id, this.geraetId()).subscribe({
      error: (err) => console.log('Fehler beim Löschen:', err)
    });
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
    this.modalOpenPosition.set(item.ort as Position);
  }

  onModalSaved(data: ItemFormData) { // reagiert auf saved-output von modal
    const position = this.modalOpenPosition();
    if (!position) return;

    const editId = this.editingItemId();

    if (editId) {
      this.itemService.updateItem(editId, this.geraetId(), { ...data, ort: position }).subscribe({
        next: () => {
          this.modalOpenPosition.set(null);
          this.editingItemId.set(null);
        },
        error: (err) => console.log('Fehler beim Aktualisieren:', err)
      });
    } else {
      this.itemService.addItem(this.geraetId(), this.schubladeIndex(), { ...data, ort: position }).subscribe({
        next: () => {
          this.modalOpenPosition.set(null);
          this.editingItemId.set(null);
        },
        error: (err) => console.log('Fehler beim Anlegen:', err)
      });
    }
  }

  onModalCancelled() { //reagiert auf cancelled-output von modal
    this.modalOpenPosition.set(null);
    this.editingItemId.set(null);
  }

}
