import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { GeraeteService } from '../../shared/geraete-service';
import { ProfilTable } from "./profil-table/profil-table";
import { Auth } from '../../shared/auth';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

interface GeraetData {
  name: string;
  geraetTyp: string;
  anzahlSchubladen: string;
}

@Component({
  selector: 'app-profil-home',
  imports: [FormField, ProfilTable, TitleCasePipe],
  templateUrl: './profil-home.html',
  styleUrl: './profil-home.css',
})
export class ProfilHome implements OnInit {
  private geraeteService = inject(GeraeteService);
  private auth = inject(Auth);
  private router = inject(Router);

  username = computed(() => this.auth.user()?.username ?? ''); 

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
    if (this.geraetForm().invalid()) { return; } // wenn formular nicht richtig ausgefuellt dann nciht speichern

    const daten = this.geraet();
    console.log('Gerät gespeichert:', daten);
    this.geraeteService.addGeraet(daten).subscribe({
      next: () => {
        this.resetForm();
        this.closeModal();
      },
      error: (err) => console.log('Fehler beim Anlegen:', err)
    });
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

  deleteAccount() { //loescht userdaten nach abfrage und log out
  const bestaetigt = confirm('Profil wirklich unwiderruflich löschen? Alle Geräte und Items gehen verloren.');
  if (!bestaetigt) return;

  this.auth.deleteAccount().subscribe({
    next: () => this.router.navigate(['/']),
    error: (err) => console.log('Fehler beim Löschen des Profils:', err)
  });
}

  ngOnInit(): void {
    this.geraeteService.loadGeraete();
  }

}
