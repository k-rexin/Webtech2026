import { Component, inject, OnInit, signal } from '@angular/core';
import { Dataservice } from '../shared/dataservice';
import { Member } from '../shared/member';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  imports: [ReactiveFormsModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table  implements OnInit{ //oninit ist eine abstrakte methode deswegen muss ngonint eingefuegt werden

  private myservice = inject(Dataservice); // service immer als private deklarieren

  members = signal<Member[]> ([]); // anstelle von einer null hier leeres Array
  //members: WritableSignal<Member[]> = signal([]);
  filteredMembers = signal<Member[]> ([]); 
  search = new FormControl(''); 


  async ngOnInit(): Promise<void> {
    this.members.set(await this.myservice.getAllMembers()); // hier set setzt für das signal den wert
    //this.members ist any[] und deswegen muss hier await/asyny / Promise ausageb hin
    this.filteredMembers.set(this.members());
    
    console.log('filteredMembers (in table): ' , this.filteredMembers());
  }

  filter() {
    const value = this.search.value?.toLowerCase() || ''; //wenn value null ist wird leerer string angezeigt und ? sagt für dern falls falls value nicht null ist dann wirds zu lowercase
    console.log('value : ', value);
    this.filteredMembers.set(this.members()
    .filter(m => m.forename.toLowerCase().includes(value) ||
                 m.surname.toLowerCase().includes(value)  ||
                 m.email.toLowerCase().includes(value)
            ))

  }
  
  

}
