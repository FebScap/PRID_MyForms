import {Component} from '@angular/core';
import {FormService} from "../../services/form.service";
import {Form} from "../../models/form";
import {Instance} from "../../models/instance";
import {AuthenticationService} from "../../services/authentication.service";
import {Role} from "../../models/user";


@Component({
    selector: 'templateProject',
    templateUrl: './view-forms.component.html',
    styleUrl: './view-forms.component.css'
})
export class ViewFormsComponent {
    forms?: Form[];

    constructor(private formService: FormService, private authenticationService: AuthenticationService) {
        if(this.authenticationService.currentUser?.role == Role.Admin) {
            this.formService.getAll().subscribe((res) => this.forms = res);
        } else {
            this.formService.getAllForCurrentUser().subscribe((res) => this.forms = res);
        }
        
    }

    protected readonly Instance = Instance;
}