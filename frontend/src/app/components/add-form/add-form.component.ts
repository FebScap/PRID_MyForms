import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '../../services/form.service';
import { AuthenticationService } from '../../services/authentication.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-add-form',
    templateUrl: './add-form.component.html',
    styleUrls: ['./add-form.component.css']
})
export class AddFormComponent {
    public formGroup!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private formService: FormService,
        private authenticationService: AuthenticationService
    ) {
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
            isPublic: [false]
        });
    }

    get isFormValid() {
        return this.formGroup.valid;
    }

    saveForm() {
        if (this.isFormValid) {
            const newForm = {
                ...this.formGroup.value,
                owner: this.authenticationService.currentUser?.id, // Le propriétaire est l'utilisateur connecté
                questions: [] // Formulaire vide
            };

            this.formService.addForm(newForm).subscribe(() => {
                this.router.navigate(['/view-forms']); // Retour à la liste des formulaires
            });
        }
    }

    goBack() {
        this.router.navigate(['/']); // Retour à la vue précédente
    }

    ngOnInit() {
        console.log('AddFormComponent chargé');
    }

    private uniqueTitleValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: boolean } | null> => {
            const currentOwnerId = this.authenticationService.currentUser?.id.toString();
            return this.formService.isTitleUnique(control.value, currentOwnerId).pipe(
                map((isUnique: boolean) => (isUnique ? null : { notUnique: true }))
            );
        };
    }
}
