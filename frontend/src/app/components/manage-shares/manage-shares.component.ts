import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AccessService} from "../../services/access.service";

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

    constructor(
        private accessService: AccessService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.formId = Number(this.route.snapshot.paramMap.get('id'));
        this.formTitle = this.route.snapshot.paramMap.get('formTitle') || 'Form';

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
        // Replace this with a call to fetch available users from a backend service
        this.users = [
            { id: 1, name: 'Boris Verhaegen' },
            { id: 2, name: 'Xavier Pigeolet' },
        ];
    }

    addAccess(): void {
        if (!this.selectedUser || !this.newAccessType) {
            this.snackBar.open('Select a user and an access type.', 'Close', { duration: 3000 });
            return;
        }

        const newAccess = {
            userId: this.selectedUser.id,
            accessType: this.newAccessType,
        };

        this.accessService.addAccess(this.formId, newAccess).subscribe({
            next: () => {
                this.snackBar.open('Access added successfully.', 'Close', { duration: 3000 });
                this.loadAccesses();
            },
            error: () => {
                this.snackBar.open('Error adding access.', 'Close', { duration: 3000 });
            },
        });
    }

    updateAccess(userId: number, accessType: 'user' | 'editor'): void {
        const updatedAccess = { accessType };

        this.accessService.updateAccess(this.formId, userId, updatedAccess).subscribe({
            next: () => {
                this.snackBar.open('Access updated successfully.', 'Close', { duration: 3000 });
                this.loadAccesses();
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
                this.loadAccesses();
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
