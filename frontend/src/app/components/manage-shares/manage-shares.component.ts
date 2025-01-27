import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AccessService} from "../../services/access.service";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-manage-shares',
    templateUrl: './manage-shares.component.html',
    styleUrls: ['./manage-shares.component.css'],
})
export class ManageSharesComponent implements OnInit {
    public formId!: number;
    public accesses: any[] = [];
    public users: any[] = [];
    public selectedUser: any;
    public newAccessType: 'user' | 'editor' = 'user';
    public formTitle: string = '';
    public isUserChecked: boolean = true; // Default to 'user' checkbox checked
    public isEditorChecked: boolean = false;

    constructor(
        private accessService: AccessService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit(): void {
        // Récupère le paramètre `formId` depuis l'URL
        this.route.paramMap.subscribe((params) => {
            this.formId = Number(this.route.snapshot.paramMap.get('id'));
        });

        this.loadAccesses();
        this.loadUsers();
    }

    loadAccesses(): void {
        this.accessService.getAccesses(this.formId).subscribe({
            next: (accesses) => {
                this.accesses = accesses;
            },
            error: () => {
                this.snackBar.open('Error loading accesses.', 'Close', { duration: 3000 });
            },
        });
    }
    
    loadUsers(): void {
        this.accessService.getEligibleUsers(this.formId).subscribe({
            next: (users) => {
                this.users = users;
            },
            error: () => {
                this.snackBar.open('Error loading eligible users.', 'Close', { duration: 3000 });
            },
        });
    }

    onUserCheckboxChange(isChecked: boolean): void {
        if (!isChecked) {
            this.isEditorChecked = false; // Uncheck editor if user is unchecked
        }
    }

    onEditorCheckboxChange(isChecked: boolean): void {
        if (isChecked) {
            this.isUserChecked = true; // Automatically check user if editor is checked
        }
    }

    addAccess(): void {
        if (!this.selectedUser || (!this.isUserChecked && !this.isEditorChecked)) {
            this.snackBar.open('Select a user and at least one access type.', 'Close', { duration: 3000 });
            return;
        }

        const accessType = this.isEditorChecked ? 1 : 0;

        this.accessService.addAccess(1, { userId: this.selectedUser.id, accessType }).subscribe({
            next: () => {
                this.snackBar.open('Access added successfully.', 'Close', { duration: 3000 });
                this.loadUsers(); // Refresh available users after adding access
            },
            error: () => {
                this.snackBar.open('Error adding access.', 'Close', { duration: 3000 });
            },
        });
    }

    updateAccess(userId: number, accessType: 0 | 1): void {
        const updatedAccess = { accessType };

        this.accessService.updateAccess(this.formId, userId, updatedAccess).subscribe({
            next: () => {
                this.snackBar.open('Access updated successfully.', 'Close', { duration: 3000 });
                this.loadAccesses(); // Recharge les accès pour refléter les modifications
            },
            error: () => {
                this.snackBar.open('Error updating access.', 'Close', { duration: 3000 });
            },
        });
    }

    deleteAccess(userId: number): void {
        this.accessService.deleteAccess(this.formId, userId).subscribe({
            next: () => {
                this.snackBar.open('Access removed successfully.', 'Close', { duration: 3000 });
                this.loadAccesses(); // Recharge les accès pour refléter les modifications
            },
            error: () => {
                this.snackBar.open('Error removing access.', 'Close', { duration: 3000 });
            },
        });
    }

    back(): void {
        this.router.navigate(['/view_form', this.formId]);
    }
}
