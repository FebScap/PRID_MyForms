import {Component, Input} from "@angular/core";
import {Question, Type} from "../../models/question";
import {Instance} from "../../models/instance";
import {NumberInput} from "@angular/cdk/coercion";
import {Answer} from "../../models/answer";
import {OpenInstanceService} from "../../services/open-instance.service";
import {OptionListService} from "../../services/option-list.service";
import {InformationComponent} from "../information/information.component";
import {OptionList} from "../../models/option-list";

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html'
})
export class QuestionComponent {
    protected readonly Type = Type;
    @Input() question: Question | undefined;
    @Input() instance: Instance | undefined;
    @Input() answer: Answer | undefined;
    @Input() questionCount: NumberInput | undefined;
    public optionList: OptionList | undefined;
    isChecked: boolean = false;

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
    }

    getCountTostring(): string {
        return this.openInstanceService.getquestionX() + 1 + " / " + this.questionCount;
    }

    getType(): Type {
        return this.question?.type ?? Type.Short;
    }
    
    getOptionListValue(): number {
        return Number(this.answer?.value) ?? 0;
    }
    
    

    onChange() {

    }
}