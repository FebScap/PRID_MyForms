import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {AuthenticationService} from "./authentication.service";
import {Instance} from "../models/instance";
import {map} from "rxjs/operators";
import {Answer} from "../models/answer";
import {Form} from "../models/form";

@Injectable({ providedIn: 'root' })
export class OpenInstanceService {
    private questionXSource = new BehaviorSubject<number>(0);
    public questionX$ = this.questionXSource.asObservable();
    
    private answersSource = new BehaviorSubject<Answer[]>([]);
    public answers = this.answersSource.asObservable();

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private authenticationService: AuthenticationService) { }

    nextQuestion() {
        this.questionXSource.next(this.questionXSource.getValue() + 1);
    }

    previousQuestion() {
        this.questionXSource.next(this.questionXSource.getValue() - 1);
    }

    getquestionX(): number {
        return this.questionXSource.getValue();
    }

    reset() {
        this.questionXSource.next(0);
    }

    formChanged() {
        console.log(this.answersSource.getValue());
    }
}
