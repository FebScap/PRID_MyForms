import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {QuestionService} from "../../services/question.service";
import {FormService} from "../../services/form.service";
import {InstanceService} from "../../services/instance.service";

@Component({
    templateUrl: 'open-form-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenFormDialogComponent {
    data = inject(MAT_DIALOG_DATA);

    constructor(
        private dialogRef: MatDialogRef<OpenFormDialogComponent>
    ) {
        this.dialogRef.backdropClick().subscribe(() => {
            this.cancel();
        });
    }

    cancel() {
        this.dialogRef.close('cancel');
    }
    
    openForm() {
        this.dialogRef.close('open');
    }
    
    readForm() {
        this.dialogRef.close('read');
    }
    
}