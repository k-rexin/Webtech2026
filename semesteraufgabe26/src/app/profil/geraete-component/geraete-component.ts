import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { form, required, FormField } from '@angular/forms/signals';
import { GeraeteService } from '../../shared/geraete-service';
import { GeraeteTable } from './geraete-table/geraete-table';

@Component({
  selector: 'app-geraete-component',
  imports: [GeraeteTable, FormField],
  templateUrl: './geraete-component.html',
  styleUrl: './geraete-component.css',
})
export class GeraeteComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private geraeteService = inject(GeraeteService);

  // reagiert automatisch auf aenderungen der :id in der URL
  private id = toSignal(this.route.paramMap.pipe(map(p => p.get('id')))); 

  geraet = computed(() =>
    this.geraeteService.geraete().find(g => g.id === this.id())
  ); //computed is signal dass sich automatisch aktualisiert wenn sich geraeteService.geraete()-Liste aendert 

  schubladenArray = computed(() => {
    const anzahl = Number(this.geraet()?.anzahlSchubladen ?? 0);
    // Number-wandelt string in zahl um 
    // und das andere fragt die schubladenanzahl ab und fall kein gereat gefunden wurde oder falls feld leer ist wir 0 genommen als absicherung
    return Array(anzahl).fill(0);
  })

  isEditOpen = signal(false); //bearbeiten-modal

  editModel = signal<{ name: string }>({ name: '' }); // nur name kann geandert werden

  editForm = form(this.editModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name eingeben' });
  });

  openEdit() {
    const g = this.geraet();
    if (!g) return;
    this.editModel.set({ name: g.name });
    this.isEditOpen.set(true);
  }

  cancelEdit() {
    this.isEditOpen.set(false);
  }

  submitEdit(event: Event) {
    event.preventDefault();
    if (this.editForm().invalid()) return;

    const g = this.geraet();
    if (!g) return;

    this.geraeteService.updateGeraet(g.id, { name: this.editModel().name }).subscribe({
      next: () => this.isEditOpen.set(false),
      error: (err) => console.log('Fehler beim Aktualisieren:', err)
    });
  }

  deleteGeraet() {
    const g = this.geraet();
    if (!g) return;

    const bestaetigt = confirm(`Gerät "${g.name}" wirklich löschen? Alle Inhalte gehen verloren.`);
    if (!bestaetigt) return;

    this.geraeteService.deleteGeraet(g.id).subscribe({
      next: () => this.router.navigate(['/profil']), // nach dem loeschen wieer zurueck zum profil
      error: (err) => console.log('Fehler beim Löschen:', err)
    });
  }

}
