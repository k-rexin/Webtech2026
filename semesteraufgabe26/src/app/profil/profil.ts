import { Component } from '@angular/core';
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { RouterOutlet } from '@angular/router';
import { Nav } from '../nav/nav';

@Component({
  selector: 'app-profil',
  imports: [Header, RouterOutlet, Footer, Nav],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {}
