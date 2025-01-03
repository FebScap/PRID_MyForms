import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
        this.ctlFirstName = this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
        this.ctlLastName = this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
        this.ctlDateOfBirth = this.formBuilder.control('', Validators.required);
        this.ctlPassword = this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);
        this.ctlConfirmPassword = this.formBuilder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);
        this.frm = this.formBuilder.group({
            firstName: this.ctlFirstName,
            lastName: this.ctlLastName,
            dateOfBirth: this.ctlDateOfBirth,
            email: this.ctlEmail,
            password: this.ctlPassword,
            confirmPassword: this.ctlConfirmPassword
        }, { validator: this.passwordMatchValidator });
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
        if (!group.value) {return null;}
        return group.value.password === group.value.confirmPassword ? null : { passwordNotConfirmed: true };
    }

    signup() {
        this.authenticationService.signup(this.ctlEmail, this.ctlPassword).subscribe(() => {
            if (this.authenticationService.currentUser) {
                // Connect the user
                this.router.navigate(['/']);
            }
        });
    }
}
