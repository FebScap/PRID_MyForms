import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl} from '@angular/forms';
import {Router} from '@angular/router';
import {FormService} from '../../services/form.service';
import {AuthenticationService} from '../../services/authentication.service';
import {map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {AddFormService} from "../../services/add-form.service";
import {Form} from "../../models/form";

@Component({
    selector: 'app-add-form',
    templateUrl: './add-form.component.html',
    styleUrls: ['./add-form.component.css'],
})
export class AddFormComponent implements OnDestroy {
    public formGroup!: FormGroup;
    public currentUser: any;
    private sub = new Subscription();

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private formService: FormService,
        private authenticationService: AuthenticationService,
        private addFormService: AddFormService,
    ) {
        this.addFormService.reset();
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
                value: this.authenticationService.currentUser?.firstName + " " + this.authenticationService.currentUser?.lastName,
                disabled: true
            }]
        });
        this.sub = this.addFormService.addForm.subscribe();
    }

    get isFormValid() {
        return this.formGroup.valid;
    }

    saveForm() {
        if (this.isFormValid) {
            const currentUser = this.authenticationService.currentUser;

            const newForm = new Form();

            newForm.title = this.formGroup.get('title')?.value;
            newForm.description = this.formGroup.get('description')?.value;
            newForm.isPublic = this.formGroup.get('isPublic')?.value;
            newForm.ownerId = currentUser!.id;
            
            console.log(newForm);

            this.addFormService.setForm(newForm);
        }
    }


    goBack() {
        this.router.navigate(['/']); // Retour à la vue précédente
    }

    ngOnInit() {
        console.log('AddFormComponent chargé');
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
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
