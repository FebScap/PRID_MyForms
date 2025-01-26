import {Component} from "@angular/core";
import {Form} from "../../models/form";
import {ActivatedRoute, Router} from "@angular/router";
import {FormService} from "../../services/form.service";
import {FormGroup} from "@angular/forms";
import {Instance} from "../../models/instance";
import {UserService} from "../../services/user.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {Answer} from "../../models/answer";

@Component({
    selector: 'app-view-instances',
    templateUrl: './view-instances.component.html',
})
export class ViewInstancesComponent {
    id: string | undefined;
    form?: Form;
    formGroup: FormGroup = new FormGroup({});
    instances: Instance[] = [];
    selectedInstances: any[] = [];
    
    constructor(
        private route: ActivatedRoute,
        private formService: FormService,
        private router: Router
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
        const instance = $event.source.value;

        if ($event.checked) {
           this.selectedInstances.push(instance);
        } else {
            this.selectedInstances = this.selectedInstances.filter(i => i !== instance);
        }
    }

    viewInstance(id: number) {
        this.router.navigate([`/instance/${id}`, {link: this.router.url}]);
    }

    deleteSelected() {
        
    }

    deleteAll() {
        
    }
}