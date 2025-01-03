import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Form} from "../../models/form";
import {FormService} from "../../services/form.service";


@Component({
    templateUrl: './view-form.component.html',
    styleUrl: './view-form.component.css'
})
export class ViewFormComponent {
    id: string | undefined;
    form?: Form;
    isPublic: boolean | undefined;
    
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
}