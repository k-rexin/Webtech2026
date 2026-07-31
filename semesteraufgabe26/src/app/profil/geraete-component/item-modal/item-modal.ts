// item-modal.ts
import { Component, input, output, signal, effect } from '@angular/core';
import { form, required, FormField } from '@angular/forms/signals';
import { ItemFormData } from '../../../shared/item-service';

@Component({
  selector: 'app-item-modal',
  imports: [FormField],
  templateUrl: './item-modal.html',
  styleUrl: './item-modal.css',
})
export class ItemModal {
  // Von aussen übergeben: Titel (z.B. Position) und ggf. vorhandene Werte zum Bearbeiten
  titel = input.required<string>();
  filledInData = input<ItemFormData | null>(null);

  // Nach aussen melden: saved(mit Daten) oder cancelled
  saved = output<ItemFormData>();
  cancelled = output<void>();
 
  submitted = signal(false);

  itemModel = signal<ItemFormData>({
    name: '',
    beschreibung: '',
    anzahl: '',
    mhd: '',
  });

  itemForm = form(this.itemModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Namen eingeben' });
  });

  constructor() {
    // effect() reagiert automatisch, wenn sich vorausgefuellteDaten aendert
    // (z.B. wenn das Modal für ein anderes Item erneut goeffnet wird)
    effect(() => {
      const daten = this.filledInData();
      if (daten) {
        this.itemModel.set(daten);
      } else {
        this.itemModel.set({ name: '', beschreibung: '', anzahl: '', mhd: '' });
      }
    });
  }

  submitItem(event: Event) {
    event.preventDefault();
    this.submitted.set(true);

    if (this.itemForm().invalid()) {
      return;
    }
    this.saved.emit(this.itemModel());
  }

  cancel() {
    this.cancelled.emit();
  }
}