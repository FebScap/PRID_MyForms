import {Component, inject, OnDestroy} from '@angular/core';
import {Form} from "../../models/form";
import {ActivatedRoute, Router} from "@angular/router";
import {FormService} from "../../services/form.service";
import {InstanceService} from "../../services/instance.service";
import {Instance} from "../../models/instance";
import {Question, Type} from "../../models/question";
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Answer} from "../../models/answer";
import {OpenInstanceService} from "../../services/open-instance.service";
import {OptionListService} from "../../services/option-list.service";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
    templateUrl: './instance.component.html'
})
export class InstanceComponent implements OnDestroy {
    protected readonly Type = Type;
    id: string | undefined;
    form?: Form;
    instance?: Instance;
    questions: Question[] = [];
    answers: Answer[] = [];
    questionXSubscription: Subscription;
    answersSubscription: Subscription;
    questionX: number = 0;
    answerForm = new FormGroup({});
    readonly dialog = inject(MatDialog);

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formService: FormService,
        private instanceService: InstanceService,
        private openInstanceService: OpenInstanceService,
        private formBuilder: FormBuilder,
        private optionListService: OptionListService,
        public snackBar: MatSnackBar,
    ) {
        this.openInstanceService.reset();
        this.questionXSubscription = this.openInstanceService.questionX$.subscribe(x => {
            this.questionX = x;
        });
        this.answersSubscription = this.openInstanceService.answers.subscribe(ans => {
            this.answers = ans;
        });
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
        if (this.id) {
            this.instanceService.getById(this.id).subscribe((inst) => {
                this.instance = inst;
                this.formService.getById(inst.formId.toString()).subscribe((f) => {
                    this.form = f;
                    this.questions = f.questions;

                    // Creation des controls pour chaque question
                    this.questions.forEach((q) => {
                        let control = this.formBuilder.control('');
                        let group: FormGroup = new FormGroup({});

                        if (this.instance?.completed != null)
                            control.disable();

                        if (q.optionList && q.type == Type.Check) {
                            this.optionListService.getById(q.optionList).subscribe((opt) => {
                                opt.values.forEach((v) => {
                                    if (this.getAnswers(q.id).find(ans => ans.value == v.idx.toString())) {
                                        group.addControl(v.idx.toString(), this.formBuilder.control(true));
                                    } else {
                                        group.addControl(v.idx.toString(), this.formBuilder.control(false));
                                    }
                                });
                            });
                            if (q.required)
                                group.addValidators((() => this.hasOneChecked(group) ? null : {required: true}));
                            
                            this.answerForm.addControl(q.id.toString(), group);
                        } else {
                            // Mise en place d'une value
                            if (this.getAnswers(q.id)[0])
                                control.setValue(this.getAnswers(q.id)[0].value);

                            // Mise en place des validators
                            if (q.required)
                                control.addValidators(Validators.required);
                            if (q.type == Type.Integer)
                                control.addValidators(Validators.pattern('^[0-9]*$'));
                            if (q.type == Type.Email)
                                control.addValidators(Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'));
                            if (q.type == Type.Date)
                                control.addValidators(Validators.pattern('^[0-9]{4}-[0-9]{2}-[0-9]{2}$'));

                            this.answerForm.addControl(q.id.toString(), control);
                        }
                    });
                });

                // Récupération des réponses
                this.instanceService.getAnswers(inst.id).subscribe((ans) => {
                    this.answers = ans;
                });
            });
        }
    }

    deleteInstance() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Delete Attempt',
                message: 'Are you sure you want to delete this attempt?'
            }
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res === 'confirm') {
                this.instanceService.deleteById(this.instance!.id).subscribe(res => {
                    if (!res) {
                        if (this.snackBar) {
                            this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', {duration: 10000});
                        } else {
                            console.error(`There was an error at the server. The update has not been done! Please try again.`);
                        }
                    } else {
                        this.router.navigate(['/']);
                    }
                });
            }
        });
    }

    saveInstance() {
        let i = this.instance!;
        i.completed = new Date();
        Object.assign(this.instance!, i);
        this.instanceService.update(this.instance!).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                if (this.snackBar) {
                    this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', {duration: 10000});
                } else {
                    console.error(`There was an error at the server. The update has not been done! Please try again.`);
                }
            }
        });
    }

    getAnswers(questionId: number): Answer[] {
        return this.answers.filter(ans => ans.questionId == questionId);
    }

    ngOnDestroy(): void {
        this.questionXSubscription.unsubscribe();
    }

    getForm() {
        return this.answerForm as FormGroup;
    }

    get isFormValid() {
        return this.answerForm.valid;
    }

    hasOneChecked(formGroup: FormGroup): boolean {
        return Object.values(formGroup.controls).some(control => control.value == true);
    }

    previousQuestion() {
        this.openInstanceService.previousQuestion();
    }

    nextQuestion() {
        this.openInstanceService.nextQuestion();
    }

    getQuestionX() {
        return this.openInstanceService.getquestionX();
    }
    
    get isInstanceReadOnly() {
        return this.instance?.completed;
    }
}