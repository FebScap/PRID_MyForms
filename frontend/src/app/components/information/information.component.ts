import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
    templateUrl: 'information.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InformationComponent {
    data = inject(MAT_DIALOG_DATA);

    constructor() {
    }

}