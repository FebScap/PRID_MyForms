import {Component, inject, Input} from '@angular/core';
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

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
    @Input() title: string = '<undefined>';
    @Input() formIsReadOnly: BooleanInput = true;
    @Input() form: Form | undefined;
    @Input() snackBar: MatSnackBar | undefined;
    //@ts-ignore
    @Input() questionCount: NumberInput | undefined;
    
    readonly dialog = inject(MatDialog);

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private instanceService: InstanceService,
    ) {
    }

    get currentUser() {
        return this.authenticationService.currentUser;
    }

    get currentPath() {
        return this.router.url;
    }

    get isGuest() {
        return this.currentUser && this.currentUser.role === Role.Guest;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    protected readonly coerceBooleanProperty = coerceBooleanProperty;

    deleteForm() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                dialogType: confirmDialogType.DELETE_FORM,
                form: this.form
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                if (this.snackBar) {
                    this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', {duration: 10000});
                } else {
                    console.error(`There was an error at the server. The update has not been done! Please try again.`);
                }
            } else if (res !== 'cancel') {
                this.router.navigate(['/']);
            }
        });
    }

    previousQuestion() {
        this.instanceService.previousQuestion();
    }

    nextQuestion() {
        this.instanceService.nextQuestion();
    }
    
    getQuestionX() {
        return this.instanceService.getquestionX();
    }
}
