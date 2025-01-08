import {Component, inject, OnDestroy} from '@angular/core';
import {Form} from "../../models/form";
import {ActivatedRoute} from "@angular/router";
import {FormService} from "../../services/form.service";
import {InstanceService} from "../../services/instance.service";
import {Instance} from "../../models/instance";
import {Question} from "../../models/question";
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Answer} from "../../models/answer";


@Component({
    templateUrl: './instance.component.html',
    styleUrl: './instance.component.css'
})
export class InstanceComponent implements OnDestroy {
    id: string | undefined;
    form?: Form;
    instance?: Instance;
    questions: Question[] = [];
    answers: Answer[] = [];
    subscription: Subscription;
    questionX: number = 0;
    answerForm!: FormGroup; 
    
    constructor(
        private route: ActivatedRoute,
        private formService: FormService,
        private instanceService: InstanceService,
        private formBuilder: FormBuilder
    ) {
        this.instanceService.reset();
        this.subscription = this.instanceService.questionX$.subscribe(x => {
            this.questionX = x;
        });
        
        this.answerForm = this.formBuilder.group({
            answers: this.answers
        })
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id') ?? undefined;
        if (this.id) {
            this.instanceService.getById(this.id).subscribe((inst) => {
                this.instance = inst;
                this.formService.getById(inst.formId.toString()).subscribe((f) => {
                    this.form = f;
                    this.questions = f.questions;
                });
                this.instanceService.getAnswers(inst.id).subscribe((ans) => {
                    this.answers = ans;
                });
            });
                
        }
        console.log(this.answers);
    }
    
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}