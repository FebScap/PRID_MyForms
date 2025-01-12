import {Routes, RouterModule} from '@angular/router';
import {UnknownComponent} from "../components/unknown/unknown.component";
import {LoginComponent} from "../components/login/login.component";
import {Role} from "../models/user";
import {AuthGuard} from "../services/auth.guard";
import {ViewFormsComponent} from "../components/view-forms/view-forms.component";
import {SignupComponent} from "../components/signup/signup.component";
import {ViewFormComponent} from "../components/view-form/view-form.component";
import {AddFormComponent} from "../components/add-form/add-form.component";
import {InstanceComponent} from "../components/instance/instance.component";
import {AddEditQuestionComponent} from "../components/add-edit-question/add-edit-question.component";
import {AddEditOptionListComponent} from "../components/add-edit-option-list/add-edit-option-list.component";

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
    {
        path: 'instance/:id',
        component: InstanceComponent,
        canActivate: [AuthGuard]
    },
    {   path: 'login', component: LoginComponent },
    {   path: 'add-form', component: AddFormComponent },
    {   path: 'add-form/:id', component: AddFormComponent },
    {   path: 'add-edit-question', component: AddEditQuestionComponent },
    {   path: 'add-edit-question/:id', component: AddEditQuestionComponent },
    {   path: 'add-edit-option-list', component: AddEditOptionListComponent },
    {   path: 'add-edit-option-list/:id', component: AddEditOptionListComponent },
    {   path: 'signup', component: SignupComponent},
    {   path: '**', component: UnknownComponent },
    {
        path: 'instance/:id',
        component: InstanceComponent,
        canActivate: [AuthGuard]
    },
];

export const AppRoutes = RouterModule.forRoot(appRoutes);