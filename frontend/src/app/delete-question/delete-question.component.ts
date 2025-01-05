import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {QuestionService} from "../services/question.service";

@Component({
    templateUrl: 'delete-question.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteQuestionComponent {
    data = inject(MAT_DIALOG_DATA);

    constructor(private questionService: QuestionService) {
    }

    deleteQuestion(id: number) {
        this.questionService.deleteById(id).subscribe(res => {

        });
    }

}