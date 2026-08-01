import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GeraeteService } from '../../shared/geraete-service';
import { GeraeteTable } from './geraete-table/geraete-table';

@Component({
  selector: 'app-geraete-component',
  imports: [GeraeteTable],
  templateUrl: './geraete-component.html',
  styleUrl: './geraete-component.css',
})
export class GeraeteComponent {
  private route = inject(ActivatedRoute);
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

}
