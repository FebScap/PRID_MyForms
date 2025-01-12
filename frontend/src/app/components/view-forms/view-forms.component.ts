import {AfterViewInit, Component, inject} from '@angular/core';
import {FormService} from "../../services/form.service";
import {Form} from "../../models/form";
import {Instance} from "../../models/instance";
import {AuthenticationService} from "../../services/authentication.service";
import {Role, User} from "../../models/user";
import {ConfirmDialogComponent, confirmDialogType} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {forEach} from "lodash-es";
import {SearchService} from "../../services/search.service";
import {Subscription} from "rxjs";


@Component({
    selector: 'templateProject',
    templateUrl: './view-forms.component.html',
    styleUrl: './view-forms.component.css'
})
export class ViewFormsComponent implements AfterViewInit {
    forms?: Form[] = [];
    instances?: Instance[];
    currentUser: User | undefined = new User();
    protected readonly Instance = Instance;
    readonly dialog = inject(MatDialog);

    filteredForms: Form[] = []; // Liste des formulaires filtrés
    filter: string = ''; // Filtre de recherche

    constructor(
        private formService: FormService,
        private authenticationService: AuthenticationService,
        private snackBar: MatSnackBar,
        private router: Router,
        private searchService: SearchService
    ) {
        this.currentUser = this.authenticationService.currentUser;

        if (this.currentUser?.role == Role.Admin) {
            this.formService.getAll().subscribe((res) => {
                this.forms = res
                this.filteredForms = [...this.forms];
            });
        } else if (this.currentUser?.role == Role.Guest) {
            this.formService.getAllPublic().subscribe((res) => {
                this.forms = res
                this.filteredForms = [...this.forms];
            });
        } else {
            this.formService.getAllForCurrentUser().subscribe((res) => {
                this.forms = res
                this.filteredForms = [...this.forms];
            });
        }
    }

    ngAfterViewInit(): void {
        // Charger les formulaires en fonction du rôle de l'utilisateur
        if (this.currentUser?.role === Role.Admin) {
            this.formService.getAll().subscribe(res => this.initForms(res));
        } else if (this.currentUser?.role === Role.Guest) {
            this.formService.getAllPublic().subscribe(res => this.initForms(res));
        } else {
            this.formService.getAllForCurrentUser().subscribe(res => this.initForms(res));
        }
    }

    initForms(forms: Form[]): void {
        this.filter = this.searchService.getSearchString(); // Récupère le filtre de recherche
        if (this.filter !== '')
            this.searchService.setSearchBarVisibility(true); // Affiche la barre de recherche si un filtre est déjà présent
        else 
            this.searchService.setSearchBarVisibility(false); // Cache la barre de recherche si aucun filtre n'est présent
        
        this.forms = forms;              // Stocke tous les formulaires
        this.setForms(this.filter);      // Applique le filtre
    }

    /**
     * Determines the status of the instances for a given form.
     *
     * @param form - The form object containing instances.
     * @returns A number representing the status:
     *          0 - No instances
     *          1 - In progress
     *          2 - Completed
     */
    getInstancesStatus(form: Form): number {
        let instances: Instance[] = [];
        form.instances.forEach((instance) => {
            if (this.authenticationService.currentUser?.id == instance.userId) {
                instances.push(instance);
            }
        });
        if (instances.length != 0) {
            if (instances[instances.length - 1].completed != null) {
                return 2;//completed
            } else {
                return 1;//in progress
            }
        }
        return 0;//no instances
    }

    getLatestInstance(form: Form): Instance | undefined {
        let instances: Instance[] = [];
        form.instances.forEach((instance) => {
            if (this.authenticationService.currentUser?.id == instance.userId) {
                instances.push(instance);
            }
        });
        return instances[instances.length - 1];
    }

    openForm(form: Form) {
        let instances: Instance[] = [];
        form.instances.forEach((instance) => {
            if (this.authenticationService.currentUser?.id == instance.userId) {
                instances.push(instance);
            }
        });
        switch (this.getInstancesStatus(form)) {
            default:
            case 0:
                this.formService.createInstance(form).subscribe(res => {
                    this.router.navigate(['/instance', res.id]);
                });
                break;
            case 1:
                this.router.navigate(['/instance', instances[instances.length - 1].id]);
                break;
            case 2:
                const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                    data: {
                        dialogType: confirmDialogType.OPEN_FORM,
                        form: form
                    }
                });
                dialogRef.afterClosed().subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. Please try again.`, 'Dismiss', {duration: 10000});
                    } else if (res == 'read') {
                        this.router.navigate(['/instance', instances[instances.length - 1].id]);
                    } else if (res.id) {
                        this.router.navigate(['/instance', res.id]);
                    } else if (res != 'cancel') {
                        this.snackBar.open(`There was an error at the server. Please try again.`, 'Dismiss', {duration: 10000});
                    }

                });
                break;
        }
    }

    // Méthode appelée lors d'un changement de filtre
    filterChanged(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value.toLowerCase().trim();
        this.searchService.setSearch(filterValue); // Envoie le filtre à SearchService

        this.setForms(filterValue); // Applique le filtre
    }

    setForms(filterValue: string): void {
        // @ts-ignore
        this.filteredForms = this.forms.filter(form => {
            return (
                form.title.toLowerCase().includes(filterValue) ||  // Filtre sur le titre
                form.description?.toLowerCase().includes(filterValue) ||  // Filtre sur la description (si elle existe)
                form.owner.firstName.toLowerCase().includes(filterValue) ||  // Filtre sur le prénom du propriétaire
                form.owner.lastName.toLowerCase().includes(filterValue) ||  // Filtre sur le nom du propriétaire
                form.owner.email?.toLowerCase().includes(filterValue)  // Filtre sur l'email du propriétaire
            );
        });
    }

    trackById(index: number, form: Form): number {
        return form.id; // Utilise l'ID comme clé unique
    }
    
    get isSearchBarVisible(): boolean {
        return this.searchService.getSearchBarVisibility(); // Récupère la visibilité de la barre de recherche
    }

}