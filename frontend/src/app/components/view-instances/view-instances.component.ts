import {Component} from "@angular/core";
import {Form} from "../../models/form";
import {ActivatedRoute} from "@angular/router";
import {FormService} from "../../services/form.service";

@Component({
    selector: 'app-view-instances',
    templateUrl: './view-instances.component.html',
})
export class ViewInstancesComponent {
    id: string | undefined;
    form?: Form;
    
    constructor(
        private route: ActivatedRoute,
        private formService: FormService,
    ) {
        
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
        if (this.id) {
            this.formService.getById(this.id).subscribe((res) => {
                this.form = res;
            });
        }
    }

}