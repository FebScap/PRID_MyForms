import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent {
    public frm!: FormGroup;
    public ctlFirstName!: FormControl;
    public ctlLastName!: FormControl;
    public ctlDateOfBirth!: FormControl;
    public ctlEmail!: FormControl;
    public ctlPassword!: FormControl;
    public ctlConfirmPassword!: FormControl;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.ctlEmail = this.formBuilder.control('', [Validators.required, Validators.email], [this.emailUsed()]);
        this.ctlFirstName = this.formBuilder.control('', [
            Validators.minLength(3),
            Validators.maxLength(50),
            this.noWhitespaceValidator
        ]);
        this.ctlLastName = this.formBuilder.control('', [
            Validators.minLength(3),
            Validators.maxLength(50),
            this.noWhitespaceValidator
        ]);
        this.ctlDateOfBirth = this.formBuilder.control('', [Validators.required, this.ageValidator]);
        this.ctlPassword = this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);
        this.ctlConfirmPassword = this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);

        this.frm = this.formBuilder.group({
            firstName: this.ctlFirstName,
            lastName: this.ctlLastName,
            dateOfBirth: this.ctlDateOfBirth,
            email: this.ctlEmail,
            password: this.ctlPassword,
            confirmPassword: this.ctlConfirmPassword
        }, { validators: [this.passwordMatchValidator] });
    }

    emailUsed(): AsyncValidatorFn {
        let timeout: NodeJS.Timeout;
        return (ctl: AbstractControl) => {
            clearTimeout(timeout);
            const email = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    this.authenticationService.isEmailAvailable(email).subscribe(res => {
                        resolve(res ? null : { emailUsed: true });
                    });
                }, 300);
            });
        };
    }

    passwordMatchValidator(group: FormGroup): ValidationErrors | null {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { passwordNotConfirmed: true };
    }

    noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value || '';
        if (value.trim() !== value) {
            return { whitespace: true };
        }
        return null;
    }

    ageValidator(control: AbstractControl): ValidationErrors | null {
        const birthDate = new Date(control.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            return age - 1 < 18 ? { invalidAge: true } : null;
        }

        return age < 18 || age > 125 ? { invalidAge: true } : null;
    }

    signup() {
        if (this.frm.valid) {
            const userData = this.frm.value; // Récupère toutes les données du formulaire
            this.authenticationService.signup(userData).subscribe(() => {
                if (this.authenticationService.currentUser) {
                    this.router.navigate(['/']);
                }
            });
        }
    }

}
