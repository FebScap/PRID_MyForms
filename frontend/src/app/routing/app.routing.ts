import {Routes, RouterModule} from '@angular/router';

import {TemplateComponent} from '../components/template/template.component';
import {UnknownComponent} from "../components/unknown/unknown.component";
import {LoginComponent} from "../components/login/login.component";
import {Role} from "../models/user";
import {AuthGuard} from "../services/auth.guard";
import {ViewFormsComponent} from "../components/view-forms/view-forms.component";

const appRoutes: Routes = [

    {
        path: '',
        component: ViewFormsComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
        data: {roles: [Role.User, Role.Admin, Role.Guest]}
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {path: '**', component: UnknownComponent}

];

export const AppRoutes = RouterModule.forRoot(appRoutes);
