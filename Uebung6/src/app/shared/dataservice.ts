import { Service } from '@angular/core';
import { Member } from './member';

@Service()
export class Dataservice { //ein service ist ein singleton d.h. es gibt nur ein objekt davon

    async getAllMembers(): Promise<Member[]> { //durch asny wird promise zurueckgegeben
        const response = await fetch('assets/members.json');
        return response.json(); // gibt den body von json zurueck
    }

}
