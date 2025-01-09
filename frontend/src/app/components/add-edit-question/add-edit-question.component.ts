import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../services/question.service';
import { OptionListService } from '../../services/option-list.service';

@Component({
    selector: 'app-add-edit-question',
    templateUrl: './add-edit-question.component.html',
    styleUrls: ['./add-edit-question.component.css']
})
export class AddEditQuestionComponent implements OnInit {
    public questionForm!: FormGroup;
    public isNew: boolean = true; // Par défaut, on suppose une nouvelle question
    public questionTypes: string[] = ['short', 'long', 'date', 'email', 'integer', 'check', 'combo', 'radio'];
    public optionLists: any[] = []; // Remplir avec les listes d'options disponibles
    public requiresOptionList: boolean = false;
    public questionId?: number;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private questionService: QuestionService,
        private optionListService: OptionListService
    ) {}

    ngOnInit(): void {
        // Initialisation du formulaire
        this.questionForm = this.formBuilder.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.minLength(3)]],
            type: ['', Validators.required],
            optionList: [{ value: null, disabled: true }], // Désactivé par défaut
            required: [false]
        });

        // Récupération des données d'édition si nécessaire
        const questionId = this.route.snapshot.params['id'];
        this.isNew = !questionId;

        if (!this.isNew) {
            this.loadQuestion(questionId);
        }

        // Charger les listes d'options
        this.loadOptionLists();
    }

    private loadQuestion(questionId: number): void {
        this.questionService.getById(questionId).subscribe({
            next: (question) => {
                this.questionForm.patchValue({
                    title: question.title,
                    description: question.description,
                    type: question.type,
                    optionList: question.optionList,
                    required: question.required
                });

                // Activer ou désactiver le champ optionList en fonction du type de question
                this.toggleOptionList(question.type);
            },
            error: (err) => {
                console.error('Error loading question:', err);
            }
        });
    }
    
    private loadOptionLists(): void {
        this.optionListService.getAll().subscribe({
            next: (optionLists) => {
                this.optionLists = optionLists; // Variable contenant les options disponibles
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

    private toggleOptionList(type: string): void {
        const optionListControl = this.questionForm.get('optionList');
        if (['radio', 'check', 'combo'].includes(type)) {
            optionListControl?.enable();
        } else {
            optionListControl?.disable();
            optionListControl?.setValue(null); // Réinitialiser la valeur
        }
    }


    saveQuestion(): void {
        if (this.questionForm.invalid) return;

        const questionData = this.questionForm.value;
        if (this.isNew) {
            this.questionService.create(questionData).subscribe({
                next: () => {
                    this.router.navigate(['/', { id: questionData.formId }]);
                },
                error: (err) => {
                    console.error('Error creating question:', err);
                }
            });
        } else {
            this.questionService.update(questionData).subscribe({
                next: () => {
                    this.router.navigate(['/', { id: questionData.formId }]);
                },
                error: (err) => {
                    console.error('Error updating question:', err);
                }
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/view-form']);
    }

    createOptionList(): void {
        // Naviguer vers la vue d'ajout d'une liste d'options
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
        return this.requiresOptionList && selectedOptionList && this.optionLists.find(ol => ol.id === selectedOptionList)?.editable;
    }
}
