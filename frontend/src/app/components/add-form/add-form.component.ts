import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FormService} from '../../services/form.service';
import {AuthenticationService} from '../../services/authentication.service';
import {map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {Form} from "../../models/form";
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
    public isFormValid = false;
    public isNew: boolean = true; // Par défaut, on suppose qu'on ajoute un nouveau formulaire
    private formId?: number; // ID du formulaire en cas d'édition

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private formService: FormService,
        private authenticationService: AuthenticationService,
        private snackBar: MatSnackBar,
        private route: ActivatedRoute // Pour récupérer les paramètres de l'URL
    ) {
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

        this.formGroup.statusChanges.subscribe(status => {
            this.isFormValid = this.formGroup.valid;
        });
    }

    ngOnInit() {
        console.log('AddFormComponent chargé');

        // Vérifier si l'URL contient un ID de formulaire
        const formIdParam = this.route.snapshot.paramMap.get('id');
        this.formId = formIdParam ? Number(formIdParam) : undefined;

        this.isNew = !this.formId; // Si l'ID est absent ou invalide, on crée un nouveau formulaire

        if (!this.isNew && this.formId !== undefined) {
            this.loadForm(this.formId); // Charger les données du formulaire existant
        }
    }


    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    private loadForm(formId: number): void {
        if (!formId || isNaN(formId)) {
            console.error('Invalid form ID:', formId);
            this.router.navigate(['/']); // Redirection si l'ID est invalide
            return;
        }

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
                this.router.navigate(['/']); // Redirection si le formulaire n'existe pas
            }
        });
    }

    saveForm(): void {
        if (!this.formGroup.valid) return;

        console.log(this.formGroup.value);
        const formData = {
            ...this.formGroup.value,
            ownerId: this.currentUser?.id ?? 0,  // Assurez-vous que `ownerId` est valide
            owner: this.currentUser
        };


        if (this.isNew) {
            this.formService.addForm(formData).subscribe({
                next: () => {
                    console.log('Form created successfully');
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    console.error('Error updating form:', err);
                }
            });

        } else {
            this.formService.update({...formData, id: this.formId}).subscribe({
                next: () => {
                    console.log('Form updated successfully');
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    console.error('Error updating form:', err);
                }
            });
        }
    }

    private uniqueTitleValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: boolean } | null> => {
            const currentOwnerId = this.authenticationService.currentUser?.id.toString();
            return this.formService.isTitleUnique(control.value, currentOwnerId).pipe(
                map((isUnique: boolean) => (isUnique ? null : {notUnique: true}))
            );
        };
    }
}
