import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profil',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {}
