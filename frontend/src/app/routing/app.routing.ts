import {Routes, RouterModule} from '@angular/router';
import {UnknownComponent} from "../components/unknown/unknown.component";
import {LoginComponent} from "../components/login/login.component";
import {Role} from "../models/user";
import {AuthGuard} from "../services/auth.guard";
import {ViewFormsComponent} from "../components/view-forms/view-forms.component";
import {SignupComponent} from "../components/signup/signup.component";
import {ViewFormComponent} from "../components/view-form/view-form.component";
import {AddFormComponent} from "../components/add-form/add-form.component";

const appRoutes: Routes = [

    {
        path: '',
        component: ViewFormsComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
    },
    {
        path: 'view_form/:id',
        component: ViewFormComponent,
        canActivate: [AuthGuard]
    },
    {   path: 'login', component: LoginComponent },
    {   path: 'add-form', component: AddFormComponent },
    {   path: 'signup', component: SignupComponent},
    {   path: '**', component: UnknownComponent }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);