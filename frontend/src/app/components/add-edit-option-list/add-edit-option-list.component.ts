import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OptionListService } from '../../services/option-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-add-edit-option-list',
    templateUrl: './add-edit-option-list.component.html',
    styleUrls: ['./add-edit-option-list.component.css']
})
export class AddEditOptionListComponent implements OnInit, OnDestroy {
    public optionListForm!: FormGroup;
    public isNew = true;
    public options: { value: string, selected: boolean }[] = [];
    public newOptionValue = '';
    public optionListId?: number;
    public isOptionListValid = false;
    private sub = new Subscription();

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private optionListService: OptionListService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.optionListForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3)]]
        });

        // Ajout du contrôle pour le champ "New Option Value"
        this.optionListForm.addControl('newOptionValue', this.formBuilder.control(''));

        this.optionListId = this.route.snapshot.params['id'];
        this.isNew = !this.optionListId;

        if (!this.isNew) {
            this.loadOptionList(<number>this.optionListId);
        }

        this.sub = this.optionListForm.statusChanges.subscribe(() => {
            this.isOptionListValid = this.optionListForm.valid && this.options.length > 0;
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    private loadOptionList(id: number): void {
        this.optionListService.getById(id).subscribe({
            next: (optionList) => {
                this.optionListForm.patchValue({ name: optionList.name });
                this.options = optionList.values.map((v: any) => ({ value: v.label, selected: false }));
            },
            error: (err) => {
                console.error(err);
                this.snackBar.open('Error loading option list.', 'Close', { duration: 3000 });
                this.router.navigate(['/manage-option-lists']);
            }
        });
    }
    
    addOption(): void {
        if (this.newOptionValue.trim()) {
            this.options.push({ value: this.newOptionValue, selected: false });
            this.newOptionValue = '';
        }
    }

    deleteOption(index: number): void {
        this.options.splice(index, 1);
        /*const optionToDelete = this.options[index];
        const optionListId = this.optionListId; // Assurez-vous que l'ID est défini

        if (optionListId) {
            this.optionListService.deleteOptionValue(optionListId, optionToDelete.idX).subscribe({
                next: (success) => {
                    if (success) {
                        this.snackBar.open('Option deleted successfully!', 'Close', { duration: 3000 });
                        this.options.splice(index, 1); // Supprime de l'affichage seulement si la suppression a réussi
                    }
                },
                error: () => {
                    this.snackBar.open('Error deleting option.', 'Close', { duration: 3000 });
                }
            });
        }*/
    }


    deleteSelectedOptions(): void {
        this.options = this.options.filter(option => !option.selected);
    }

    hasSelectedOptions(): boolean {
        return this.options.some(option => option.selected);
    }

    save(): void {
        if (!this.isOptionListValid) return;

        const optionListData = {
            ...this.optionListForm.value,
            values: this.options.map(option => ({ value: option.value }))
        };
        console.log(optionListData);

        if (this.isNew) {
            this.optionListService.create(optionListData).subscribe({
                next: () => {
                    this.snackBar.open('Option list created successfully!', 'Close', { duration: 3000 });
                    this.router.navigate(['/manage-option-lists']);
                },
                error: (err) => {
                    console.error(err);
                    this.snackBar.open('Error creating option list.', 'Close', { duration: 3000 });
                }
            });
        } else {
            this.optionListService.update(this.optionListId!, optionListData).subscribe({
                next: () => {
                    this.snackBar.open('Option list updated successfully!', 'Close', { duration: 3000 });
                    this.router.navigate(['/manage-option-lists']);
                },
                error: (err) => {
                    console.error(err);
                    this.snackBar.open('Error updating option list.', 'Close', { duration: 3000 });
                }
            });
        }
    }

    cancel(): void {
        if (this.optionListForm.dirty || this.options.length > 0) {
            if (confirm('Unsaved changes will be lost. Do you want to proceed?')) {
                this.router.navigate(['/manage-option-lists']);
            }
        } else {
            this.router.navigate(['/manage-option-lists']);
        }
    }

    drop(event: any): void {
        const previousIndex = event.previousIndex;
        const currentIndex = event.currentIndex;
        const movedItem = this.options.splice(previousIndex, 1)[0];
        this.options.splice(currentIndex, 0, movedItem);
    }
}
