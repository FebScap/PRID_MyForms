import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccessService } from "../../services/access.service";
import { FormService } from "../../services/form.service"; // Import du service form

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
    public formTitle: string = '';
    public isUserChecked: boolean = true;
    public isEditorChecked: boolean = false;
    public isPublicForm: boolean = false;

    constructor(
        private accessService: AccessService,
        private formService: FormService, 
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit(): void {
        // Récupère le paramètre `formId` depuis l'URL
        this.route.paramMap.subscribe((params) => {
            this.formId = Number(this.route.snapshot.paramMap.get('id'));
            this.loadFormDetails(); // Charge les détails du formulaire
        });

        this.loadAccesses();
        this.loadUsers();
    }

    loadFormDetails(): void {
        this.formService.getById(String(this.formId)).subscribe({
            next: (form) => {
                this.formTitle = form.title;
                this.isPublicForm = form.isPublic; // Stocke si le form est public
            },
            error: () => {
                this.snackBar.open('Error loading form details.', 'Close', { duration: 3000 });
            },
        });
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

        const newAccess = {
            userId: this.selectedUser.id,
            formId: this.formId,
            accessType
        };

        console.log('Adding access:', newAccess);

        this.accessService.addAccess(newAccess).subscribe({
            next: () => {
                this.snackBar.open('Access added successfully.', 'Close', { duration: 3000 });
                this.loadAccesses();
                this.loadUsers();
                this.selectedUser = ''; // Reset la sélection
            },
            error: (err) => {
                console.error('Error adding access:', err);
                this.snackBar.open('Error adding access.', 'Close', { duration: 3000 });
            },
        });
    }

    updateAccess(userId: number, accessType: 0 | 1): void {
        if (this.isPublicForm && accessType === 0) {
            // Si le formulaire est public et qu'on veut mettre un accès "user" seul, on supprime l'accès
            this.deleteAccess(userId);
            return;
        }
        
        this.accessService.updateAccess(this.formId, userId, accessType).subscribe({
            next: () => {
                this.snackBar.open('Access updated successfully.', 'Close', { duration: 3000 });
                this.loadAccesses();
            },
            error: (err) => {
                console.error('Error updating access:', err);
                this.snackBar.open('Error updating access.', 'Close', { duration: 3000 });
            },
        });
    }

    deleteAccess(userId: number): void {
        this.accessService.deleteAccess(this.formId, userId).subscribe({
            next: () => {
                this.snackBar.open('Access removed successfully.', 'Close', { duration: 3000 });
                this.loadAccesses();
                this.loadUsers();
            },
            error: (err) => {
                console.error('Error removing access:', err);
                this.snackBar.open('Error removing access.', 'Close', { duration: 3000 });
            },
        });
    }
}
