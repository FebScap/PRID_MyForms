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
    @Input() formIsReadOnly: BooleanInput = true;
    @Input() form: Form | undefined;
    @Input() instance: Instance | undefined;
    @Input() snackBar: MatSnackBar | undefined;
    //@ts-ignore
    @Input() questionCount: NumberInput | undefined;
    @Input() isFormValid: BooleanInput | undefined;
    @Input() isQuestionValid: boolean | undefined;
    @Output() saveQuestion = new EventEmitter<void>();
    
    
    readonly dialog = inject(MatDialog);

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private instanceService: InstanceService,
        private openInstanceService: OpenInstanceService,
        private addFormService: AddFormService,
        private formService: FormService,
        private searchService: SearchService
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
        this.searchService.reset();
        this.router.navigate(['/login']);
    }

    protected readonly coerceBooleanProperty = coerceBooleanProperty;
    @Input() isOptionListValid!: boolean;

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

    deleteInstance() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                dialogType: confirmDialogType.DELETE_INSTANCE,
                instance: this.instance
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
        this.openInstanceService.previousQuestion();
    }

    nextQuestion() {
        this.openInstanceService.nextQuestion();
    }
    
    getQuestionX() {
        return this.openInstanceService.getquestionX();
    }
    
    public addForm() {
        this.router.navigate(['/add-form']);
    }
    
    public editForm(formId: number | undefined) {
        this.router.navigate(['/add-form', formId]);
    }

    saveForm() {
        let newForm = this.addFormService.getForm();
        this.formService.addForm(newForm).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                if (this.snackBar) {
                    this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', {duration: 10000});
                } else {
                    console.error(`There was an error at the server. The update has not been done! Please try again.`);
                }
            }
        });
    }
    
    onSaveClick () {
        this.saveQuestion.emit();
    }
    
    get isInstanceReadOnly() {
        return this.instance?.completed;
    }

    saveInstance() {
        let i = this.instance!;
        i.completed = new Date();
        Object.assign(this.instance!, i);
        this.instanceService.update(this.instance!).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                if (this.snackBar) {
                    this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', {duration: 10000});
                } else {
                    console.error(`There was an error at the server. The update has not been done! Please try again.`);
                }
            }
        });
    }
    
    switchSearchBarVisibility() {
        this.searchService.setSearchBarVisibility(!this.searchService.getSearchBarVisibility());
    }
}