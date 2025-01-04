﻿import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Form} from "../../models/form";
import {FormService} from "../../services/form.service";
import {Question, Type} from "../../models/question";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {QuestionService} from "../../services/question.service";


@Component({
    templateUrl: './view-form.component.html',
    styleUrl: './view-form.component.css'
})
export class ViewFormComponent {
    id: string | undefined;
    form?: Form;
    isPublic: boolean | undefined;
    readonly dialog = inject(MatDialog);
    
    constructor(
        private route: ActivatedRoute,
        private formService: FormService
    ) {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
        if (this.id) {
            this.formService.getById(this.id).subscribe((res) => {
                this.form = res;
                this.isPublic = res.isPublic;
            });
        }
    }


    openDialog(question: Question) {
        const dialogRef = this.dialog.open(DeleteQuestionDialogComponent, {
            data: {
                question: question
            }
        });
    }

    protected readonly Type = Type;
}

@Component({
    templateUrl: 'delete-question-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteQuestionDialogComponent {
    data = inject(MAT_DIALOG_DATA);

    constructor(private questionService: QuestionService) {
    }

    deleteQuestion(id: number) {
        this.questionService.deleteById(id).subscribe(res => {
        });
    }
}