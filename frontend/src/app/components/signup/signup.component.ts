import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.css']
})

export class SignupComponent implements OnInit {
    signupForm!: FormGroup;
    loading = false;
    submitted = false;

    // Form controls
    ctlFirstName!: FormControl;
    ctlLastName!: FormControl;
    ctlDateOfBirth!: FormControl;
    ctlEmail!: FormControl;
    ctlPassword!: FormControl;
    ctlConfirmPassword!: FormControl;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        // Rediriger vers la page d'accueil si déjà connecté
        if (this.authenticationService.currentUser) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        // Initialize form controls
        this.ctlFirstName = this.formBuilder.control('', Validators.required);
        this.ctlLastName = this.formBuilder.control('', Validators.required);
        this.ctlDateOfBirth = this.formBuilder.control('', Validators.required);
        this.ctlEmail = this.formBuilder.control('', [Validators.required, Validators.email]);
        this.ctlPassword = this.formBuilder.control('', [Validators.required, Validators.minLength(6)]);
        this.ctlConfirmPassword = this.formBuilder.control('', Validators.required);

        // Create form group
        this.signupForm = this.formBuilder.group({
            firstName: this.ctlFirstName,
            lastName: this.ctlLastName,
            dateOfBirth: this.ctlDateOfBirth,
            email: this.ctlEmail,
            password: this.ctlPassword,
            confirmPassword: this.ctlConfirmPassword
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(group: FormGroup) {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    // Simplify form field access
    get f() { return this.signupForm.controls; }

    // On form submit
    onSubmit() {
        this.submitted = true;

        // Stop if form is invalid
        if (this.signupForm.invalid) return;

        this.loading = true;
        // Perform signup
        this.authenticationService.signup({
            firstName: this.f.firstName.value,
            lastName: this.f.lastName.value,
            dateOfBirth: this.f.dateOfBirth.value,
            email: this.f.email.value,
            password: this.f.password.value
        }).subscribe({
            next: () => {
                // Navigate to the login page after signup
                this.router.navigate(['/login']);
            },
            error: error => {
                const errors = error.error.errors;
                for (let err of errors) {
                    this.signupForm.get(err.propertyName.toLowerCase())?.setErrors({ custom: err.errorMessage });
                }
                this.loading = false;
            }
        });
    }
}
