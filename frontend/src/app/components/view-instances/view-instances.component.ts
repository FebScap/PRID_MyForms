import {Component} from "@angular/core";
import {Form} from "../../models/form";
import {ActivatedRoute, Router} from "@angular/router";
import {FormService} from "../../services/form.service";
import {FormGroup} from "@angular/forms";
import {Instance} from "../../models/instance";
import {UserService} from "../../services/user.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {Answer} from "../../models/answer";
import {InstanceService} from "../../services/instance.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-view-instances',
    templateUrl: './view-instances.component.html',
})
export class ViewInstancesComponent {
    id: string | undefined;
    form?: Form;
    formGroup: FormGroup = new FormGroup({});
    instances: Instance[] = [];
    selectedInstances: number[] = [];
    
    constructor(
        private route: ActivatedRoute,
        private formService: FormService,
        private router: Router,
        private instanceService: InstanceService,
        private snackBar: MatSnackBar
    ) {
        
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
        if (this.id) {
            this.formService.getById(this.id).subscribe((f) => {
                this.form = f;
                f.instances.forEach((i) => {
                    if (i.completed) {
                        this.instances.push(i);
                    }
                });
            });
        }
    }

    selectOption($event: MatCheckboxChange) {
        const instance = Number.parseInt($event.source.value);

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
        this.instanceService.deleteSelected(this.selectedInstances).subscribe((res) => {
            if (!res) {
                this.snackBar.open('An error occurred while deleting instances', 'Close');
            } else {
                this.instances = this.instances.filter(i => !this.selectedInstances.includes(i.id));
                if (this.instances.length === 0) {
                    this.router.navigate(['/view_form/' + this.form?.id]);
                }
            }
        });
        this.instances = this.instances.filter(i => !this.selectedInstances.includes(i.id));
    }

    deleteAll() {
        this.instanceService.deleteAll(this.form?.id!).subscribe((res) => {
            if (!res) {
                this.snackBar.open('An error occurred while deleting instances', 'Close');
            } else {
                this.router.navigate(['/view_form/' + this.form?.id]);
            }
        });
    }
}