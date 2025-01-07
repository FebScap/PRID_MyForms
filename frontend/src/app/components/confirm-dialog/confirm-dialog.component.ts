import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {QuestionService} from "../../services/question.service";
import {FormService} from "../../services/form.service";

@Component({
    templateUrl: 'confirm-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
    data = inject(MAT_DIALOG_DATA);
    protected readonly confirmDialogType = confirmDialogType;

    constructor(
        private questionService: QuestionService,
        private formService: FormService,
        private dialogRef: MatDialogRef<ConfirmDialogComponent>
    ) {
        this.dialogRef.backdropClick().subscribe(() => {
            this.dialogRef.close('cancel');
        });
    }

    cancel() {
        this.dialogRef.close('cancel');
    }

    getConfirmDialogType() {
        return this.data.dialogType;
    }

    deleteQuestion() {
        let q = this.data.question;
        this.questionService.deleteById(q.id).subscribe(res => {
            this.dialogRef.close(res);
        });
    }

    togglePublic() {
        let f = this.data.form;

        f.isPublic = !f.isPublic;
        this.formService.update(f).subscribe(res => {
            this.dialogRef.close(res);
        });
    }

    deleteForm() {
        let f = this.data.form;
        this.formService.deleteById(f.id).subscribe(res => {
            this.dialogRef.close(res);
        });
    }

    openForm(isNewResponse: boolean) {
        if (isNewResponse) {
            this.formService.createInstance(this.data.form).subscribe(res => {
                this.dialogRef.close(res);
            });
        } else {
            this.dialogRef.close('read');
        }
    }
}

export enum confirmDialogType {
    DELETE_QUESTION, TOGGLE_PUBLIC, DELETE_FORM, OPEN_FORM,
}