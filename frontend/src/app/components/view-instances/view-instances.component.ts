import {Component} from "@angular/core";
import {Form} from "../../models/form";
import {ActivatedRoute} from "@angular/router";
import {FormService} from "../../services/form.service";
import {FormGroup} from "@angular/forms";
import {Instance} from "../../models/instance";
import {UserService} from "../../services/user.service";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
    selector: 'app-view-instances',
    templateUrl: './view-instances.component.html',
})
export class ViewInstancesComponent {
    id: string | undefined;
    form?: Form;
    formGroup: FormGroup = new FormGroup({});
    instances: Instance[] = [];
    
    constructor(
        private route: ActivatedRoute,
        private formService: FormService,
        private userService: UserService
    ) {
        
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
        if (this.id) {
            this.formService.getById(this.id).subscribe((f) => {
                this.form = f;
            });
        }
    }

    selectOption($event: MatCheckboxChange) {
        
    }

    viewInstance(id: number) {
        
    }

    deleteSelected() {
        
    }

    deleteAll() {
        
    }
}