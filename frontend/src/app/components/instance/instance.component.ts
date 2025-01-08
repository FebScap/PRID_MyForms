import {Component, inject, OnDestroy} from '@angular/core';
import {Form} from "../../models/form";
import {ActivatedRoute} from "@angular/router";
import {FormService} from "../../services/form.service";
import {InstanceService} from "../../services/instance.service";
import {Instance} from "../../models/instance";
import {Question} from "../../models/question";
import {Subscription} from "rxjs";


@Component({
    templateUrl: './instance.component.html',
    styleUrl: './instance.component.css'
})
export class InstanceComponent implements OnDestroy {
    id: string | undefined;
    form?: Form;
    instance?: Instance;
    questions: Question[] = [];
    subscription: Subscription;
    questionX: number = 0;
    
    constructor(
        private route: ActivatedRoute,
        private formService: FormService,
        private instanceService: InstanceService,
    ) {
        this.instanceService.reset();
        this.subscription = this.instanceService.questionX$.subscribe(x => {
            this.questionX = x;
        });
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
        if (this.id) {
            this.instanceService.getById(this.id).subscribe((res) => {
                this.instance = res;
                this.formService.getById(res.formId.toString()).subscribe((f) => {
                    this.form = f;
                    this.questions = f.questions;
                });
            });
                
        }
    }
    
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}