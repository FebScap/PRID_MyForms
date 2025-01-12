import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {Role} from "../../models/user";
import {BooleanInput, coerceBooleanProperty, NumberInput} from "@angular/cdk/coercion";
import {Form} from "../../models/form";
import {FormService} from "../../services/form.service";
import {ConfirmDialogComponent, confirmDialogType} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InstanceService} from "../../services/instance.service";
import {OpenInstanceService} from "../../services/open-instance.service";
import {AddFormService} from "../../services/add-form.service";
import {Instance} from "../../models/instance";
import {SearchService} from "../../services/search.service";

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
    @Input() title: string = '<undefined>';
    @Input() link: string = '/';
    @Input() hasArrowBack: boolean | undefined;
    @Input() hasMenu: boolean | undefined;
    @Input() isLogin: boolean | undefined;
    

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private searchService: SearchService
    ) {
    }

    get currentUser() {
        return this.authenticationService.currentUser;
    }

    logout() {
        this.authenticationService.logout();
        this.searchService.reset();
        this.router.navigate(['/login']);
    }
}