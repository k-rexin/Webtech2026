import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Profil } from './profil/profil';
import { authguardGuard } from './shared/authguard-guard';
import { ProfilHome } from './profil/profil-home/profil-home';
import { GeraeteInhalt } from './profil/geraete-inhalt/geraete-inhalt';

export const routes: Routes = [
    { path: "", component: Login, pathMatch: 'full' }, // muss passen und ist nicht nur praefix einer laengeren route
    {
        path: "profil", component: Profil,
        canActivate: [authguardGuard],
        children: [
            { path: "", component: ProfilHome }, // hier wird nur /profil in url gezeigt
            { path: "geraet/:id", component: GeraeteInhalt},
        ]
    },
    { path: "**", redirectTo: "" }, // alle falschen eingaben zurueck zu login

];
