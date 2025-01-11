import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {AuthenticationService} from "./authentication.service";
import {Instance} from "../models/instance";
import {catchError, map} from "rxjs/operators";
import {Answer} from "../models/answer";
import {Form} from "../models/form";

@Injectable({ providedIn: 'root' })
export class AnswersService {

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private authenticationService: AuthenticationService) { }

    postAnswer(answer: Answer): Observable<boolean> {
        return this.http.post<any>(`${this.baseUrl}api/answers`, answer).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
    
    putAnswer(answer: Answer): Observable<boolean> {
        return this.http.put<any>(`${this.baseUrl}api/answers`, answer).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    getAnswers(instanceId: number): Observable<Answer[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/instances/${instanceId}/answers`).pipe(
            map(res => plainToInstance(Answer, res))
        );
    }
}
