import { Component, computed, inject } from '@angular/core';
import { ItemService } from '../../../shared/item-service';
import { GeraeteService } from '../../../shared/geraete-service';


@Component({
  selector: 'app-profil-table',
  imports: [],
  templateUrl: './profil-table.html',
  styleUrl: './profil-table.css',
})
export class ProfilTable {
private itemService = inject(ItemService);
private geraeteService = inject(GeraeteService);

private positionReadable(ort: string): string {
    if (ort.endsWith('links')) return 'Links';
    if (ort.endsWith('mitte')) return 'Mitte';
    if (ort.endsWith('rechts')) return 'Rechts';
    return '';
  }

  allItems = computed(() => {
    const result: { name: string; beschreibung: string; anzahl: string; mhd: string; ort: string} [] = [];

    for(const geraet of this.geraeteService.geraete()) {
      if(geraet.geraetTyp === 'truhe'){
        const items = this.itemService.getItems(geraet.id);
        for(const item of items) {
          result.push({
            name: item.name,
            beschreibung: item.beschreibung,
            anzahl: item.anzahl,
            mhd: item.mhd,
            ort: `${geraet.name} (${this.positionReadable(item.ort)})`,
          });
        }

      }else{
        const nrSchublade = Number(geraet.anzahlSchubladen);
        for(let i = 0; i < nrSchublade; i++)
        {
          const tableId = `${geraet.id}-schublade-${i}`;
          const items = this.itemService.getItems(tableId);
          for(const item of items) {
            result.push({
              name: item.name,
              beschreibung: item.beschreibung,
              anzahl: item.anzahl,
              mhd: item.mhd,
              ort: `${geraet.name} - Schublade ${i + 1} (${this.positionReadable(item.ort)})`,
            })
          }
        }
      }
    }
    return result;
  })
}
