import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OptionListService } from '../../services/option-list.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
        private snackBar: MatSnackBar
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
     * Supprime une liste d'options.
     */
    deleteOptionList(optionList: OptionList): void {
        if (!this.isEditable(optionList)) {
            this.snackBar.open('This option list cannot be deleted.', 'Close', { duration: 3000 });
            return;
        }

        this.optionListService.delete(optionList.id).subscribe({
            next: () => {
                this.snackBar.open('Option list deleted successfully!', 'Close', { duration: 3000 });
                this.loadOptionLists();
            },
            error: () => {
                this.snackBar.open('Error deleting option list.', 'Close', { duration: 3000 });
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
