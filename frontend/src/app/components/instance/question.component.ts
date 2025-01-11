import {Component, Input} from "@angular/core";
import {Question, Type} from "../../models/question";
import {Instance} from "../../models/instance";
import {NumberInput} from "@angular/cdk/coercion";
import {Answer} from "../../models/answer";
import {OpenInstanceService} from "../../services/open-instance.service";
import {OptionListService} from "../../services/option-list.service";
import {OptionList} from "../../models/option-list";
import {FormControl, FormGroup} from "@angular/forms";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {AnswersService} from "../../services/answer.service";

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html'
})
export class QuestionComponent {
    protected readonly Type = Type;
    @Input() question: Question | undefined;
    @Input() instance: Instance | undefined;
    @Input() answers: Answer[] | undefined;
    @Input() questionCount: NumberInput | undefined;
    @Input() answerForm: FormGroup | undefined;

    public optionList: OptionList | undefined;
    public ans: Answer | undefined;

    constructor(
        private openInstanceService: OpenInstanceService,
        private optionListService: OptionListService,
        private answersService: AnswersService
    ) {
    }

    ngOnInit(): void {
        if (this.question?.type == Type.Combo || this.question?.type == Type.Radio || this.question?.type == Type.Check) {
            if (this.question?.optionList != null) {
                this.optionListService.getById(this.question.optionList).subscribe((res) => {
                    this.optionList = res;
                });
            }
        }
        if (this.question?.type != Type.Check) {
            this.ans = this.answers?.[0];
        }
    }

    getCountTostring(): string {
        return this.openInstanceService.getquestionX() + 1 + " / " + this.questionCount;
    }

    getType(): Type {
        return this.question?.type ?? Type.Short;
    }

    getQuestionControl(): FormControl {
        return this.answerForm?.get(this.question!.id.toString()) as FormControl;
    }

    getQuestionGroup(): FormGroup {
        return this.answerForm?.get(this.question!.id.toString()) as FormGroup;
    }

    isChecked(optionId: number): boolean {
        return this.answerForm?.get(this.question!.id.toString())?.get(optionId.toString())?.value;
    }

    selectOption($event: MatCheckboxChange) {
        const value = $event.source.value;

        if ($event.checked) {
            this.answerForm?.get(this.question!.id.toString())?.get(value)?.setValue(true);
        } else {
            this.answerForm?.get(this.question!.id.toString())?.get(value)?.setValue(false);
        }
        this.formChangedEvent();
    }

    formChangedEvent(question: Question = this.question!) {
        let value = this.answerForm?.get(question.id.toString())?.value;
        let answer = new Answer();
        answer.questionId = question.id;
        answer.instanceId = this.instance!.id;
        
        if (question.type == Type.Check) {
            let chekedValues: number[] = [];
            for (let key in value) {
                if (value[key]) {
                    chekedValues.push(parseInt(key));
                    // TODO: Ajouter la gestion des réponses multiples
                }
            }
            console.log(chekedValues);
        } else {
            answer.value = value;
            
            if (this.answers?.find(ans => ans.questionId == question.id)) {
                let existingAnswer = this.answers?.find(ans => ans.questionId == question.id);
                if (existingAnswer) {
                    Object.assign(existingAnswer, answer);
                    this.answersService.putAnswer(answer).subscribe(res => {
                        if (res) {
                            // Pour la mise à jour dynamique
                            this.openInstanceService.changeAnswer(this.answers!);
                        }
                    });
                }
            } else {
                this.answersService.postAnswer(answer).subscribe(res => {
                    if (res) {
                        // Pour la mise à jour dynamique
                        this.answers?.push(answer);
                        this.openInstanceService.changeAnswer(this.answers!);
                    }
                });
            }
        }
    }
}