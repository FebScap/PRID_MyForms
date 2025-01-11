import {Component, OnDestroy} from '@angular/core';
import {Form} from "../../models/form";
import {ActivatedRoute} from "@angular/router";
import {FormService} from "../../services/form.service";
import {InstanceService} from "../../services/instance.service";
import {Instance} from "../../models/instance";
import {Question, Type} from "../../models/question";
import {Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Answer} from "../../models/answer";
import {OpenInstanceService} from "../../services/open-instance.service";
import {OptionListService} from "../../services/option-list.service";
import {G} from "@angular/cdk/keycodes";


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

    constructor(
        private route: ActivatedRoute,
        private formService: FormService,
        private instanceService: InstanceService,
        private openInstanceService: OpenInstanceService,
        private formBuilder: FormBuilder,
        private optionListService: OptionListService
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

                            if (q.required)
                                control.addValidators(Validators.required);
                            if (q.type == Type.Integer)
                                control.addValidators(Validators.pattern('^[0-9]*$'));
                            if (q.type == Type.Email)
                                control.addValidators(Validators.email);
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

    getAnswers(questionId: number): Answer[] {
        return this.answers.filter(ans => ans.questionId == questionId);
    }

    ngOnDestroy(): void {
        this.questionXSubscription.unsubscribe();
    }

    getForm() {
        return this.answerForm as FormGroup;
    }

    hasOneChecked(formGroup: FormGroup): boolean {
        return Object.values(formGroup.controls).some(control => control.value == true);
    }
}