import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';

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

  //hier noch username aus backend abfragen ??

  isModalOpen = signal(false);
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

  geraetForm = form(this.geraet, (schemaPath) => {
    required(schemaPath.name, { message: 'Gerätenamen eingeben' });
    required(schemaPath.geraetTyp, { message: 'Bitte einen Gerätetyp auswählen' });
  });

  resetForm() {
    this.geraet.set({
      name: '',
      geraetTyp: '',
      anzahlSchubladen: '',
    });
  }

  cancelModal() { // leer das formular vor dem schliesen
    this.resetForm();
    this.closeModal();
  }

  submitGeraet(event: Event) {
    event.preventDefault(); // is standard bei event um altes schlechtes html verhalten zu preventen
    const daten = this.geraet();
    console.log('Gerät gespeichert:', daten);
    // hier später: Daten irgendwo speichern/weiterverarbeiten !!
    this.resetForm(); //leer das formular nach dem speichern der daten und schliesst dann erst
    this.closeModal();
  }
}
