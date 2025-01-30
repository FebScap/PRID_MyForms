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
    usedOptionLists: Map<number, boolean> = new Map(); // Map stockant l'état de chaque OptionList
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
                this.optionLists = lists.sort((a, b) => a.name.localeCompare(b.name));

                // Vérification individuelle si l'option list est utilisée
                this.optionLists.forEach(optionList => {
                    this.updateOptionListUsage(optionList.id);
                });
            },
            error: () => {
                this.snackBar.open('Error loading option lists.', 'Close', { duration: 3000 });
            }
        });
    }

    updateOptionListUsage(optionListId: number): void {
        this.optionListService.isOptionListUsed(optionListId).subscribe({
            next: (isUsed) => {
                this.usedOptionLists.set(optionListId, isUsed);
            },
            error: () => {
                console.error(`Error checking if option list ${optionListId} is used.`);
                this.usedOptionLists.set(optionListId, false); // Sécurité : on suppose qu'elle n'est pas utilisée
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

                        // Supprime localement l'option list de l'affichage
                        this.optionLists = this.optionLists.filter(ol => ol.id !== optionList.id);

                        // Supprime son état dans la map des listes utilisées
                        this.usedOptionLists.delete(optionList.id);
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

    isOptionListUsed(optionListId: number): boolean {
        return this.usedOptionLists.get(optionListId) ?? false;
    }

    isDeletable(optionList: OptionList): boolean {
        return !this.isOptionListUsed(optionList.id) && this.isEditable(optionList);
    }
}
