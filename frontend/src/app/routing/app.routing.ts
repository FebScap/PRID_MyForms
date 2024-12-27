import { Routes, RouterModule } from '@angular/router';

<<<<<<< HEAD
import {TemplateComponent} from '../components/template/template.component';
import {UnknownComponent} from "../components/unknown/unknown.component";
import {LoginComponent} from "../components/login/login.component";
import {Role} from "../models/user";
import {AuthGuard} from "../services/auth.guard";
import {ViewFormsComponent} from "../components/view-forms/view-forms.component";
=======
import { TemplateComponent } from '../components/template/template.component';
import { UnknownComponent } from "../components/unknown/unknown.component";
import { LoginComponent } from "../components/login/login.component";
import { SignupComponent } from "../components/signup/signup.component"; // Import du composant Signup
import { Role } from "../models/user";
import { AuthGuard } from "../services/auth.guard";
import { HomeComponent } from "../components/home/home.component";
>>>>>>> martin

const appRoutes: Routes = [
    {
        path: '',
        component: ViewFormsComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
        data: { roles: [Role.User, Role.Admin, Role.Guest] }
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',  // Ajout de la route pour le composant Signup
        component: SignupComponent
    },
    {
        path: '**',
        component: UnknownComponent
    }
import { Routes, RouterModule } from '@angular/router';
import { TemplateComponent } from '../components/template/template.component';
import { UnknownComponent } from "../components/unknown/unknown.component";
import { LoginComponent } from "../components/login/login.component";
import { SignupComponent } from "../components/signup/signup.component"; // Import du composant Signup
import { Role } from "../models/user";
import { AuthGuard } from "../services/auth.guard";
import { HomeComponent } from "../components/home/home.component";
import {TemplateComponent} from '../components/template/template.component';
import {UnknownComponent} from "../components/unknown/unknown.component";
import {LoginComponent} from "../components/login/login.component";
import {Role} from "../models/user";
import {AuthGuard} from "../services/auth.guard";
import {ViewFormsComponent} from "../components/view-forms/view-forms.component";
        component: ViewFormsComponent,
        data: { roles: [Role.User, Role.Admin, Role.Guest] }
    {
        path: 'signup',  // Ajout de la route pour le composant Signup
        component: SignupComponent
    },
    {
        path: '**',
        component: UnknownComponent
    }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
