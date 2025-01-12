import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OptionListService } from '../../services/option-list.service';

@Component({
    selector: 'app-add-edit-option-list',
    templateUrl: './add-edit-option-list.component.html',
    styleUrls: ['./add-edit-option-list.component.css']
})
export class AddEditOptionListComponent implements OnInit {
    public optionListForm!: FormGroup;
    public isNew = true;
    public options: { value: string, selected: boolean }[] = [];
    public newOptionValue = '';
    public optionListId?: number;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private optionListService: OptionListService
    ) {}

    ngOnInit(): void {
        this.optionListForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3)]]
        });

        this.optionListId = this.route.snapshot.params['id'];
        this.isNew = !this.optionListId;

        if (!this.isNew) {
            this.loadOptionList(<number>this.optionListId);
        }
    }

    private loadOptionList(id: number): void {
        this.optionListService.getById(id).subscribe({
            next: (optionList) => {
                this.optionListForm.patchValue({ name: optionList.name });
                this.options = optionList.values.map((v: any) => ({ value: v.value, selected: false }));
            },
            error: (err) => console.error(err)
        });
    }

    addOption(): void {
        this.options.push({ value: this.newOptionValue, selected: false });
        this.newOptionValue = '';
    }

    deleteOption(index: number): void {
        this.options.splice(index, 1);
    }

    deleteSelectedOptions(): void {
        this.options = this.options.filter(option => !option.selected);
    }

    hasSelectedOptions(): boolean {
        return this.options.some(option => option.selected);
    }

    save(): void {
        if (this.optionListForm.invalid || this.options.length === 0) return;

        const optionListData = {
            ...this.optionListForm.value,
            values: this.options.map(option => ({ value: option.value }))
        };

        if (this.isNew) {
            this.optionListService.create(optionListData).subscribe({
                next: () => this.router.navigate(['/manage-option-lists']),
                error: (err) => console.error(err)
            });
        } else {
            this.optionListService.update(this.optionListId!, optionListData).subscribe({
                next: () => this.router.navigate(['/manage-option-lists']),
                error: (err) => console.error(err)
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

    isOptionListValid(): boolean {
        return this.optionListForm.valid && this.options.length > 0;
    }

    drop(event: any): void {
        const previousIndex = event.previousIndex;
        const currentIndex = event.currentIndex;
        const movedItem = this.options.splice(previousIndex, 1)[0];
        this.options.splice(currentIndex, 0, movedItem);
    }
}
