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
    public currentUser: any;

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
            isPublic: [false],
            owner: [{ value: this.authenticationService.currentUser?.firstName + " " + this.authenticationService.currentUser?.lastName, disabled: true }]
        });
    }

    get isFormValid() {
        return this.formGroup.valid;
    }

    saveForm() {
        if (this.isFormValid) {
            const currentUser = this.authenticationService.currentUser;

            const newForm = {
                title: this.formGroup.get('title')?.value,
                description: this.formGroup.get('description')?.value,
                isPublic: this.formGroup.get('isPublic')?.value,
                owner: {
                    id: currentUser?.id,
                    firstName: currentUser?.firstName,
                    lastName: currentUser?.lastName,
                    email: currentUser?.email,
                    password: currentUser?.password
                }
            };

            this.formService.addForm(newForm).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (err) => {
                    console.error('Error saving form:', err);
                }
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
