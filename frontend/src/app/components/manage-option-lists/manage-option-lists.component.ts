import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OptionListService } from '../../services/option-list.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { OptionList } from '../../models/option-list';

@Component({
    selector: 'app-manage-option-lists',
    templateUrl: './manage-option-lists.component.html',
    styleUrls: ['./manage-option-lists.component.css']
})
export class ManageOptionListsComponent implements OnInit {
    optionLists: OptionList[] = [];
    currentUser: any;

    constructor(
        private optionListService: OptionListService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {
        this.currentUser = this.authenticationService.currentUser;
    }

    ngOnInit(): void {
        this.loadOptionLists();
    }

    /**
     * Charge la liste des options depuis le service.
     */
    loadOptionLists(): void {
        this.optionListService.getAllForCurrentUser().subscribe({
            next: (lists) => {
                // Tri alphabétique par nom
                this.optionLists = lists.sort((a, b) => a.name.localeCompare(b.name));
            },
            error: () => {
                this.snackBar.open('Error loading option lists.', 'Close', { duration: 3000 });
            }
        });
    }

    /**
     * Redirige vers la vue d'ajout/édition pour créer une nouvelle liste.
     */
    addOptionList(): void {
        this.router.navigate(['/add-edit-option-list']);
    }

    /**
     * Redirige vers l'édition d'une liste d'options.
     */
    editOptionList(optionList: OptionList): void {
        if (this.isEditable(optionList)) {
            this.router.navigate(['/add-edit-option-list', optionList.id]);
        }
    }

    /**
     * Duplique une liste d'options.
     */
    duplicateOptionList(optionList: OptionList): void {
        const copy = { ...optionList, id: null, ownerId: this.currentUser?.id, name: `${optionList.name} (Copy)` };
        this.router.navigate(['/add-edit-option-list'], { state: { optionList: copy } });
    }

    /**
     * Affiche une boîte de dialogue de confirmation avant de supprimer une liste d'options.
     */
    deleteOptionList(optionList: OptionList): void {
        if (!this.isEditable(optionList)) {
            this.snackBar.open('This option list cannot be deleted.', 'Close', { duration: 3000 });
            return;
        }

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Delete Option List',
                message: `Are you sure you want to delete the option list "${optionList.name}"? This action is irreversible.`,
                confirmText: 'Delete',
                cancelText: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res === 'confirm') {
                this.optionListService.delete(optionList.id).subscribe({
                    next: () => {
                        this.snackBar.open('Option list deleted successfully!', 'Close', { duration: 3000 });
                        this.loadOptionLists(); // Recharger la liste après suppression
                    },
                    error: () => {
                        this.snackBar.open('Error deleting option list.', 'Close', { duration: 3000 });
                    }
                });
            }
        });
    }

    /**
     * Vérifie si une liste d'options est éditable.
     */
    isEditable(optionList: OptionList): boolean {
        const isSystemList = optionList.ownerId === null;
        const isAdmin = this.currentUser?.role === 'Admin';

        return (!isSystemList || isAdmin);
    }
}
