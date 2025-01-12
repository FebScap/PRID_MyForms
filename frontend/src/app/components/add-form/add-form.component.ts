import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../services/form.service';
import { AuthenticationService } from '../../services/authentication.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AddFormService } from "../../services/add-form.service";
import { Form } from "../../models/form";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-add-form',
    templateUrl: './add-form.component.html',
    styleUrls: ['./add-form.component.css'],
})
export class AddFormComponent implements OnInit, OnDestroy {
    public formGroup!: FormGroup;
    public currentUser: any;
    private sub = new Subscription();
    public isFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isNew: boolean = true; // Par défaut, on suppose qu'on ajoute un nouveau formulaire
    private formId?: number; // ID du formulaire en cas d'édition

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private formService: FormService,
        private authenticationService: AuthenticationService,
        private addFormService: AddFormService,
        private snackBar: MatSnackBar,
        private route: ActivatedRoute // Pour récupérer les paramètres de l'URL
    ) {
        this.addFormService.reset();
        this.currentUser = this.authenticationService.currentUser;
        this.formGroup = this.formBuilder.group({
            title: [
                '',
                [Validators.required, Validators.minLength(3)],
                [this.uniqueTitleValidator()]
            ],
            description: [
                '',
                [Validators.minLength(3), Validators.maxLength(200)]
            ],
            isPublic: [false],
            owner: [{
                value: `${this.currentUser?.firstName} ${this.currentUser?.lastName}`,
                disabled: true
            }]
        });

        this.sub = this.addFormService.addForm.subscribe();
        this.formGroup.statusChanges.subscribe(status => {
            this.isFormValid$.next(this.formGroup.valid);
        });
    }

    ngOnInit() {
        console.log('AddFormComponent chargé');

        // Vérifier si l'URL contient un ID de formulaire
        this.formId = Number(this.route.snapshot.paramMap.get('id'));
        this.isNew = isNaN(this.formId); // Si pas d'ID dans l'URL, c'est un nouveau formulaire

        if (!this.isNew) {
            this.loadForm(this.formId); // Charger les données du formulaire existant
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    private loadForm(formId: number): void {
        this.formService.getById(String(formId)).subscribe({
            next: (form: Form) => {
                this.formGroup.patchValue({
                    title: form.title,
                    description: form.description,
                    isPublic: form.isPublic,
                    owner: `${form.owner.firstName} ${form.owner.lastName}`
                });
            },
            error: (err) => {
                console.error('Error loading form:', err);
                this.router.navigate(['/']); // Redirige si l'ID du formulaire n'existe pas
            }
        });
    }

    saveForm(): void {
        if (!this.formGroup.valid) return;

        const formData = {
            ...this.formGroup.value,
            ownerId: this.currentUser.id
        };

        if (this.isNew) {
            // Création d'un nouveau formulaire
            this.formService.addForm(formData).subscribe({
                next: () => {
                    this.router.navigate(['/']); // Redirection après création
                },
                error: (err) => {
                    console.error('Error creating form:', err);
                }
            });
        } else {
            // Mise à jour d'un formulaire existant
            this.formService.update({ ...formData, id: this.formId }).subscribe({
                next: () => {
                    this.router.navigate(['/']); // Redirection après mise à jour
                },
                error: (err) => {
                    console.error('Error updating form:', err);
                }
            });
        }
    }

    validateForm() {
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

    private uniqueTitleValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: boolean } | null> => {
            const currentOwnerId = this.authenticationService.currentUser?.id.toString();
            return this.formService.isTitleUnique(control.value, currentOwnerId).pipe(
                map((isUnique: boolean) => (isUnique ? null : { notUnique: true }))
            );
        };
    }

    protected readonly coerceBooleanProperty = coerceBooleanProperty;
}
