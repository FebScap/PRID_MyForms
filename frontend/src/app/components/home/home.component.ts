import {Component} from '@angular/core';
import {FormService} from "../../services/form.service";
import {Form} from "../../models/form";
import {User} from "oidc-client";
import {UserService} from "../../services/user.service";


@Component({
    selector: 'templateProject',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    forms?: Form[];
    userNames?: string[];

    constructor(private formService: FormService) {
        this.formService.getAll().subscribe((res) => this.forms = res)
    }
}