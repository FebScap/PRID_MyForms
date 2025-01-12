import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    templateUrl: 'confirm-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
    data = inject(MAT_DIALOG_DATA);

    constructor(
        private dialogRef: MatDialogRef<ConfirmDialogComponent>
    ) {
        this.dialogRef.backdropClick().subscribe(() => {
            this.cancel();
        });
    }

    cancel() {
        this.dialogRef.close('cancel');
    }
    
    confirm() {
        this.dialogRef.close('confirm');
    }
}