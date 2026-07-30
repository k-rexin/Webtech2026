import { Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { GeraeteService } from '../../shared/geraete-service';

interface GeraetData {
  name: string;
  geraetTyp: string;
  anzahlSchubladen: string;
}

@Component({
  selector: 'app-profil-home',
  imports: [FormField],
  templateUrl: './profil-home.html',
  styleUrl: './profil-home.css',
})
export class ProfilHome {
  private geraeteService = inject(GeraeteService);

  //hier noch username aus backend abfragen ??

  isModalOpen = signal(false); //signals informieren alle beteiligten komponenten sofort bei aenderung des werts

  openModal() {
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }

  geraet = signal<GeraetData>({
    name: '',
    geraetTyp: '',
    anzahlSchubladen: '',
  });

  geraetForm = form(this.geraet, (schemaPath) => { //zum checken ob form eingehalten wird, wenn nicht error.message
    required(schemaPath.name, { message: 'Gerätenamen eingeben' });
    required(schemaPath.geraetTyp, { message: 'Bitte einen Gerätetyp auswählen' });
  });

  submitted = signal(false); 

  submitGeraet(event: Event) { // "Speichern"
    event.preventDefault(); // is standard bei event um altes schlechtes html verhalten zu preventen
    this.submitted.set(true);
    if(this.geraetForm().invalid()) {return;} // wenn formular nicht richtig ausgefuellt dann nciht speichern

    const daten = this.geraet();
    console.log('Gerät gespeichert:', daten);
    this.geraeteService.addGeraet(daten);  // fuegt daten dem service hinzu
    this.resetForm(); //leer das formular nach dem speichern der daten und schliesst dann erst
    this.closeModal();
  }

  cancelModal() { // leert das formular vor dem schliessen "Abbrechen"
    this.resetForm();
    this.closeModal();
  }

   resetForm() {
    this.geraet.set({
      name: '',
      geraetTyp: '',
      anzahlSchubladen: '',
    });
    this.submitted.set(false); //zuruecksetzen 
  }
}
