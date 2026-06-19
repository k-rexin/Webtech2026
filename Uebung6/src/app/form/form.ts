import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {

  vornameControl = new FormControl('', Validators.required);
  nachnameControl = new FormControl('');
  emailControl = new FormControl('');
  ipAdresseControl = new FormControl('');

  create(){
    const vorname = this.vornameControl.value || ''; // || ''; anstelle !auch moeglich
    const nachname = this.nachnameControl.value;
    const email = this.emailControl.value;
    const ipAdresse = this.ipAdresseControl.value;

    const newUser = {vorname, nachname, email, ipAdresse, name: () => {vorname + nachname}}; 
    //objektvariable erkennt man an {}
    // vorname! ist nullCheck und sagt dass man zusichert dort einen wert zu haben


    console.log('Creating entry:', newUser);

  }

  isValid(){
    return this.vornameControl.value != '' &&
    this.nachnameControl.value != '' &&
    this.emailControl.value != '' &&
    this.ipAdresseControl.value != '';
  }










}
