import {Component, inject} from '@angular/core';
import {Form} from "../../models/form";
import {ActivatedRoute} from "@angular/router";
import {FormService} from "../../services/form.service";
import {InstanceService} from "../../services/instance.service";
import {Instance} from "../../models/instance";


@Component({
    templateUrl: './instance.component.html',
    styleUrl: './instance.component.css'
})
export class InstanceComponent {
    id: string | undefined;
    form?: Form;
    instance?: Instance;

    constructor(
        private route: ActivatedRoute,
        private formService: FormService,
        private instanceService: InstanceService,
    ) {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
        if (this.id) {
            this.instanceService.getById(this.id).subscribe((res) => {
                this.instance = res;
                this.formService.getById(res.formId.toString()).subscribe((f) => {
                    this.form = f;
                });
            });
                
        }
    }

    refresh() {

    }
}