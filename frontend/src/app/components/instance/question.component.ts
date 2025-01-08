import {Component, Input} from "@angular/core";
import {Question} from "../../models/question";
import {Instance} from "../../models/instance";
import {InstanceService} from "../../services/instance.service";
import {NumberInput} from "@angular/cdk/coercion";

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html'
})
export class QuestionComponent {
    @Input() question: Question | undefined;
    @Input() instance: Instance | undefined;
    @Input() questionCount: NumberInput | undefined;
    
    constructor(
        private instanceService: InstanceService
    ) {
    }

    ngOnInit(): void {
    }
    
    getCountTostring(): string {
        return this.instanceService.getquestionX()+1 + " / " + this.questionCount;
    }
    
}