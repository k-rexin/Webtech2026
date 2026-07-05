import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeraeteService } from '../../shared/geraete-service';

@Component({
  selector: 'app-geraete-inhalt',
  imports: [],
  templateUrl: './geraete-inhalt.html',
  styleUrl: './geraete-inhalt.css',
})
export class GeraeteInhalt {
  private route = inject(ActivatedRoute);
  private geraeteService = inject(GeraeteService);
  private id = this.route.snapshot.paramMap.get('id');
  //liest :id aus dr aktuellen url ab

  geraet = computed(() =>
    this.geraeteService.geraete().find(g => g.id === this.id)
); //computed is signal dass sich automatisch aktualisiert wenn sich geraeteService.geraete()-Liste aendert 

  schubladenArray = computed(() => {
    const anzahl = Number(this.geraet()?.anzahlSchubladen ?? 0);
    // Number-wandelt string in zahl um 
    // und das andere fragt die schubladenanzahl ab und fall kein gereat gefunden wurde oder falls feld leer ist wir 0 genommen als absicherung
    return Array(anzahl).fill(0);
  })

}
