import { Routes } from '@angular/router';   
import { Home } from './home/home';
import { Table } from './table/table';
import { Form } from './form/form';

export const routes: Routes = [
    {path: "", component: Home},
    {path: "read", component: Table},
    {path: "create", component: Form}
];
