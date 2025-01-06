import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {Form} from "../models/form";
import {User} from "../models/user";
import {AuthenticationService} from "./authentication.service";
import {Question} from "../models/question";

@Injectable({ providedIn: 'root' })
export class QuestionService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private authenticationService: AuthenticationService) { }

    deleteById(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/questions/${id}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
    
    public changeIdx(q: Question): Observable<boolean> {
        return this.http.put<Question>(`${this.baseUrl}api/questions`, q).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
}
