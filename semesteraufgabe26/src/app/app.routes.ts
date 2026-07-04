import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Profil } from './profil/profil';
import { authguardGuard } from './shared/authguard-guard';

export const routes: Routes = [
    {path: "", component: Login, pathMatch: 'full'}, // muss passen und ist nicht nur praefix einer laengeren route
    {path: "profil", component: Profil, canActivate: [authguardGuard] },
    {path:"**", redirectTo: ""}, // alle falschen eingaben zurueck zu login
    
];
