import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { OptionListService } from '../../services/option-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Type } from '../../models/question';

@Component({
    selector: 'app-add-edit-question',
    templateUrl: './add-edit-question.component.html',
    styleUrls: ['./add-edit-question.component.css']
})
export class AddEditQuestionComponent implements OnInit, OnDestroy {
    public questionForm!: FormGroup;
    public isNew: boolean = true; // Par défaut, on suppose qu'on ajoute une nouvelle question
    public optionLists: any[] = []; // Listes d'options disponibles
    public requiresOptionList: boolean = false;
    public questionId?: number; // ID de la question en cas d'édition
    private sub = new Subscription();
    public isQuestionValid: boolean = false;
    protected readonly Type = Type;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private questionService: QuestionService,
        private optionListService: OptionListService,
        private snackBar: MatSnackBar
    ) {
        
    }

    ngOnInit(): void {

        // Récupération de l'ID depuis l'URL pour savoir s'il s'agit d'une édition ou d'une création
        const questionIdParam = this.route.snapshot.paramMap.get('id');
        this.questionId = questionIdParam ? Number(questionIdParam) : undefined;

        // Initialisation du formulaire
        this.questionForm = this.formBuilder.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.minLength(3)]],
            type: ['', Validators.required],
            optionList: [{ value: null, disabled: true }],
            required: [false],
            formId: [this.route.snapshot.paramMap.get('formId'), Validators.required],
            idx: [null] // Champ pour gérer l'ordre des questions
        });
        
        this.isNew = !this.questionId; // Si pas d'ID, c'est une nouvelle question

        if (!this.isNew && this.questionId !== undefined) {
            this.loadQuestion(this.questionId);
        }

        this.questionForm.statusChanges.subscribe(status => {
            this.isQuestionValid = this.questionForm.valid;
        });

        this.loadOptionLists(); // Charger les listes d'options disponibles
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    private loadQuestion(questionId: number): void {
        this.questionService.getById(questionId).subscribe({
            next: (question) => {
                this.questionForm.patchValue({
                    title: question.title,
                    description: question.description,
                    type: Type[question.type],
                    optionList: question.optionList,
                    required: question.required,
                    formId: question.formId,
                    idx: question.idX
                });

                this.toggleOptionList(Type[question.type]);
            },
            error: (err) => {
                console.error('Error loading question:', err);
                this.snackBar.open('Error loading question. Redirecting...', 'Close', { duration: 5000 });
                this.router.navigate(['/']); // Redirection en cas d'erreur
            }
        });
    }

    private loadOptionLists(): void {
        this.optionListService.getAllForCurrentUser().subscribe({
            next: (optionLists) => {
                this.optionLists = optionLists;
            },
            error: (err) => {
                console.error('Error loading option lists:', err);
            }
        });
    }

    onTypeChange(): void {
        const selectedType = this.questionForm.get('type')?.value;
        this.toggleOptionList(selectedType);
    }

    private toggleOptionList(type: any): void {
        const optionListControl = this.questionForm.get('optionList');
        if (['radio', 'check', 'combo'].includes(type.toLowerCase())) {
            optionListControl?.enable();
            this.requiresOptionList = true;
        } else {
            optionListControl?.disable();
            optionListControl?.setValue(null);
            this.requiresOptionList = false;
        }
    }

    saveQuestion(): void {
        if (!this.questionForm.valid) {
            this.snackBar.open('Please fill in the required fields correctly.', 'Close', { duration: 3000 });
            return;
        }
        const questionData = {
            ...this.questionForm.value,
            type: Type[this.questionForm.value.type],
            formId: this.questionForm.get('formId')?.value,
            idx: 1
        };
        
        console.log(questionData);
        
        if (this.isNew) {
            this.questionService.create(questionData).subscribe({
                next: () => {
                    this.snackBar.open('Question created successfully!', 'Close', { duration: 3000 });
                    this.router.navigate(['/view_form', this.questionForm.value.formId]);
                },
                error: (err) => {
                    console.error('Error creating question:', err);
                    this.snackBar.open('Error creating question.', 'Close', { duration: 3000 });
                }
            });
        } else {
            this.questionService.update({ ...questionData, id: this.questionId }).subscribe({
                next: () => {
                    this.snackBar.open('Question updated successfully!', 'Close', { duration: 3000 });
                    this.router.navigate(['/view_form', this.questionForm.value.formId]);
                },
                error: (err) => {
                    console.error('Error updating question:', err);
                    this.snackBar.open('Error updating question.', 'Close', { duration: 3000 });
                }
            });
        }
    }

    createOptionList(): void {
        this.router.navigate(['/add-edit-option-list']);
    }

    editOptionList(): void {
        const selectedOptionList = this.questionForm.get('optionList')?.value;
        if (selectedOptionList) {
            this.router.navigate(['/add-edit-option-list', selectedOptionList]);
        }
    }

    get canAddOptionList(): boolean {
        return this.isNew && this.requiresOptionList;
    }

    get canEditOptionList(): boolean {
        const selectedOptionList = this.questionForm.get('optionList')?.value;
        return this.requiresOptionList && !!selectedOptionList;
    }
}
