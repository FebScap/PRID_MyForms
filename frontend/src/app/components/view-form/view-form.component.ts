import {Component, inject} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Form} from "../../models/form";
import {FormService} from "../../services/form.service";
import {Question, Type} from "../../models/question";
import {MatDialog} from "@angular/material/dialog";
import {DeleteQuestionComponent} from "../../delete-question/delete-question.component";
import {QuestionService} from "../../services/question.service";
import {MatSnackBar} from "@angular/material/snack-bar";


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
        private formService: FormService,
        private questionService: QuestionService,
        public snackBar: MatSnackBar
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

    refresh() {
        this.formService.getById(this.id!).subscribe((res) => {
            this.form = res;
            this.isPublic = res.isPublic;
        });
    }
    
    changeIdX(increase: boolean, question: Question) {
        if (increase) {
            question.idX++;
        } else {
            question.idX--;
        }
        
        this.questionService.changeIdx(question).subscribe(res => {
            if (!res) {
                this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
            }
            this.refresh();
        });
    }

    openDialogDeleteQuestion(question: Question) {
        const dialogRef = this.dialog.open(DeleteQuestionComponent, {
            data: {
                question: question
            }
        });
        
        dialogRef.afterClosed().subscribe(result => {
            this.refresh();
        });
    }

    protected readonly Type = Type;
}