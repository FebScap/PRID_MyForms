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
    public accessesUsers: any[] = [];
    public users: any[] = [];
    public usersFull: any[] = [];
    public selectedUser: any;
    public newAccessType: 'user' | 'editor' = 'user';
    public formTitle: string = '';

    constructor(
        private accessService: AccessService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
        private userService: UserService,
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
                console.log('Accesses:', accesses); // Vérifiez que les données incluent firstName et lastName
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
                console.log('Users:', users);
            },
            error: () => {
                this.snackBar.open('Error loading eligible users.', 'Close', { duration: 3000 });
            },
        });
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
