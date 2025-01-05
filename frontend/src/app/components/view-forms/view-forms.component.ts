import {Component} from '@angular/core';
import {FormService} from "../../services/form.service";
import {Form} from "../../models/form";
import {Instance} from "../../models/instance";
import {AuthenticationService} from "../../services/authentication.service";
import {Role, User} from "../../models/user";
import {forEach} from "lodash-es";
import {F} from "@angular/cdk/keycodes";


@Component({
    selector: 'templateProject',
    templateUrl: './view-forms.component.html',
    styleUrl: './view-forms.component.css'
})
export class ViewFormsComponent {
    forms?: Form[];
    currentUser: User | undefined = new User();

    constructor(private formService: FormService, private authenticationService: AuthenticationService) {
        this.currentUser = this.authenticationService.currentUser;
        if(this.currentUser?.role == Role.Admin) {
            this.formService.getAll().subscribe((res) => this.forms = res);
        } else if (this.currentUser?.role == Role.Guest) {
            this.formService.getAllPublic().subscribe((res) => this.forms = res);
        } else {
            this.formService.getAllForCurrentUser().subscribe((res) => this.forms = res);
        }
        
    }

    protected readonly Instance = Instance;
    protected readonly forEach = forEach;
    protected readonly F = F;
}