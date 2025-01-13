import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {AppRoutes} from '../routing/app.routing';

import {AppComponent} from '../components/app/app.component';
import {SetFocusDirective} from '../directives/setfocus.directive';
import {SharedModule} from './shared.module';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {fr} from 'date-fns/locale';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {NavBarComponent} from "../components/nav-bar/nav-bar.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {JwtInterceptor} from "../interceptors/jwt.interceptor";
import {UnknownComponent} from "../components/unknown/unknown.component";
import {TemplateComponent} from "../components/template/template.component";
import { LoginComponent } from '../components/login/login.component';
import {ViewFormsComponent} from "../components/view-forms/view-forms.component";
import {SignupComponent} from "../components/signup/signup.component";
import {ViewFormComponent} from "../components/view-form/view-form.component";
import {InformationComponent} from "../components/information/information.component";
import {ConfirmDialogComponent} from "../components/confirm-dialog/confirm-dialog.component";
import {InstanceComponent} from "../components/instance/instance.component";
import {QuestionComponent} from "../components/instance/question.component";
import {AddFormComponent} from "../components/add-form/add-form.component";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {AddEditQuestionComponent} from "../components/add-edit-question/add-edit-question.component";
import {AddEditOptionListComponent} from "../components/add-edit-option-list/add-edit-option-list.component";
import {AnalyzeComponent} from "../components/analyze/analyze.component";
import {ViewInstancesComponent} from "../components/view-instances/view-instances.component";
import {OpenFormDialogComponent} from "../components/open-form-dialog/open-form-dialog.component";
import {ManageOptionListsComponent} from "../components/manage-option-lists/manage-option-lists.component";
import {CdkDropList, DragDropModule} from "@angular/cdk/drag-drop";

@NgModule({
    declarations: [
        UnknownComponent,
        TemplateComponent,
        ViewFormsComponent,
        AppComponent, 
        SetFocusDirective,
        NavBarComponent,
        LoginComponent,
        SignupComponent,
        ViewFormComponent,
        ConfirmDialogComponent,
        OpenFormDialogComponent,
        InformationComponent,
        AddFormComponent,
        InformationComponent,
        InstanceComponent,
        QuestionComponent,
        AddEditQuestionComponent,
        AddEditOptionListComponent,
        AnalyzeComponent,
        ViewInstancesComponent,
        ManageOptionListsComponent,
        
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
        FormsModule,
        ReactiveFormsModule,
        AppRoutes,
        BrowserAnimationsModule,
        SharedModule,
        MatRadioGroup,
        MatRadioButton,
        CdkDropList,
        DragDropModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: MAT_DATE_LOCALE, useValue: fr},
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: ['dd/MM/yyyy'],
                },
                display: {
                    dateInput: 'dd/MM/yyyy',
                    monthYearLabel: 'MMM yyyy',
                    dateA11yLabel: 'dd/MM/yyyy',
                    monthYearA11yLabel: 'MMM yyyy',
                },
            },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync(),
    ],
    exports: [
        NavBarComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
