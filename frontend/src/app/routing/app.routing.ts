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
import {AnalyzeComponent} from "../components/analyze/analyze.component";
import {ViewInstancesComponent} from "../components/view-instances/view-instances.component";
import {ManageOptionListsComponent} from "../components/manage-option-lists/manage-option-lists.component";
import {ManageSharesComponent} from "../components/manage-shares/manage-shares.component";

const appRoutes: Routes = [

    {
        path: '',
        component: ViewFormsComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
    },
    {
        path: 'view_form/:id/analyze/view_instances',
        component: ViewInstancesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'view_form/:id/analyze',
        component: AnalyzeComponent,
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
    {   path: 'manage-shares/:id', component: ManageSharesComponent },
    {   path: 'login', component: LoginComponent },
    {   path: 'manage_option_lists', component: ManageOptionListsComponent },
    {   path: 'add-form', component: AddFormComponent },
    {   path: 'add-form/:id', component: AddFormComponent },
    {   path: 'manage-shares/:id', component: ManageSharesComponent },
    {   path: 'add-edit-question/:formId', component: AddEditQuestionComponent },
    {   path: 'add-edit-question/:formId/:id', component: AddEditQuestionComponent },
    {   path: 'add-edit-option-list', component: AddEditOptionListComponent },
    {   path: 'add-edit-option-list/:id', component: AddEditOptionListComponent },
    {   path: 'signup', component: SignupComponent},
    {   path: '**', component: UnknownComponent },
    {
        path: 'instance/:id',
        component: InstanceComponent,
        canActivate: [AuthGuard]
    }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);