import { Component, computed, inject, input, signal } from '@angular/core';
import { ItemService} from '../../../shared/item-service';
import { TitleCasePipe  } from '@angular/common';
import { FormField, form, required } from '@angular/forms/signals';
import { CdkDropList, CdkDrag, CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';

type Position = 'links' | 'mitte' | 'rechts';

interface ItemFormData {
  name: string;
  beschreibung: string;
  anzahl: string;
  mhd: string;
}

@Component({
  selector: 'app-geraete-table',
  imports: [FormField, TitleCasePipe ],
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

 modalOpenPosition = signal<Position | null>(null); //merkt sich fuer welche position modal offen ist (fuer Ort eintrag) (null = geschlossen)
submitted = signal(false);

itemModel = signal<ItemFormData>({
    name: '',
    beschreibung: '',
    anzahl: '',
    mhd: '',
  });

  itemForm = form(this.itemModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Namen eingeben '});
  });

  openModal(position: Position) {
    this.modalOpenPosition.set(position);
  }

  resetForm() {
    this.itemModel.set({ name: '', beschreibung: '', anzahl: '', mhd: '' });
    this.submitted.set(false);
  }

  cancelModal() {
    this.resetForm();
    this.modalOpenPosition.set(null);
  }

  submitItem(event: Event) {
    event.preventDefault();
    this.submitted.set(true);

    if(this.itemForm().invalid()) {return;}

     const position = this.modalOpenPosition();
     if(!position) {return};

     const data = this.itemModel();
     const ort = `${this.tableId()} ${position}`; //ort muss nicht extra eingegeben werden von user sonder setzt sich hier automatisch zusammen

    this.itemService.addItem(this.tableId(), { ...data, ort });
    this.resetForm();
    this.modalOpenPosition.set(null);
  }
 

}
