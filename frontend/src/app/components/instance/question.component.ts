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
    @Input() questionControl: FormControl | undefined;
    @Input() questionGroup: FormGroup | undefined;

    public optionList: OptionList | undefined;
    public ans: Answer | undefined;

    constructor(
        private openInstanceService: OpenInstanceService,
        private optionListService: OptionListService
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

    isChecked(optionId: number): boolean {
        return this.questionGroup?.get(optionId.toString())?.value;
    }

    onChange() {
        this.openInstanceService.formChanged();
    }

    selectOption($event: MatCheckboxChange) {
        const value = $event.source.value;
        const options = this.questionGroup?.value;
        
        if ($event.checked) {
            this.questionGroup?.get(value)?.setValue(true);
        } else {
            this.questionGroup?.get(value)?.setValue(false);
        }
    }
}