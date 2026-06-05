import { Routes } from '@angular/router';
import { Read } from './table/read/read';
import { Create } from './form/create/create';

export const routes: Routes = [
    {path: "read", component: Read},
    {path: "create", component: Create}
];
