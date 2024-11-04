import {Routes, RouterModule} from '@angular/router';

import {TemplateComponent} from '../components/template/template.component';
import {UnknownComponent} from "../components/unknown/unknown.component";
import {LoginComponent} from "../components/login/login.component";

const appRoutes: Routes = [

    {path: '', component: TemplateComponent, pathMatch: 'full'},
    {
        path: 'login',
        component: LoginComponent
    },
    {path: '**', component: UnknownComponent}

];

export const AppRoutes = RouterModule.forRoot(appRoutes);
