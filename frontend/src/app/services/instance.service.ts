import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {AuthenticationService} from "./authentication.service";
import {Instance} from "../models/instance";
import {map} from "rxjs/operators";
import {Answer} from "../models/answer";

@Injectable({ providedIn: 'root' })
export class InstanceService {
    private questionXSource = new BehaviorSubject<number>(0);
    public questionX$ = this.questionXSource.asObservable();
    
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private authenticationService: AuthenticationService) { }
    
    getById(id: string): Observable<Instance> {
        return this.http.get<any>(`${this.baseUrl}api/instances/${id}`).pipe(
            map(res => plainToInstance(Instance, res))
        );
    }
    
    getAnswers(id: number): Observable<Answer[]> {
        return this.http.get<Answer[]>(`${this.baseUrl}api/instances/${id}/answers`);
    }

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
}
