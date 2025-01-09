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

    loadQuestion(id: number): void {
        this.questionService.getQuestionById(id).subscribe(question => {
            this.questionForm.patchValue({
                title: question.title,
                description: question.description,
                type: question.type,
                optionList: question.optionList,
                required: question.required
            });

            this.requiresOptionList = ['check', 'combo', 'radio'].includes(question.type);
        });
    }

    loadOptionLists(): void {
        this.optionListService.getOptionLists().subscribe(optionLists => {
            this.optionLists = optionLists;
        });
    }

    onTypeChange(): void {
        const selectedType = this.questionForm.get('type')?.value;
        this.requiresOptionList = ['check', 'combo', 'radio'].includes(selectedType);

        if (this.requiresOptionList) {
            this.questionForm.get('optionList')?.enable();
            this.questionForm.get('optionList')?.setValidators([Validators.required]);
        } else {
            this.questionForm.get('optionList')?.disable();
            this.questionForm.get('optionList')?.clearValidators();
        }

        this.questionForm.get('optionList')?.updateValueAndValidity();
    }

    saveQuestion(): void {
        if (this.questionForm.valid) {
            const questionData = this.questionForm.value;

            if (this.isNew) {
                this.questionService.addQuestion(questionData).subscribe(() => {
                    this.router.navigate(['/view-form']);
                });
            } else {
                this.questionService.updateQuestion(questionData).subscribe(() => {
                    this.router.navigate(['/view-form']);
                });
            }
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
