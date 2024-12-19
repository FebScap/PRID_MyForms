import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {Form} from "../models/form";
import {User} from "../models/user";
import {AuthenticationService} from "./authentication.service";

@Injectable({ providedIn: 'root' })
export class FormService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private authenticationService: AuthenticationService) { }

    getAll(): Observable<Form[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/forms`).pipe(
            map(res => plainToInstance(Form, res))
        );
    }
    
    getAllForCurrentUser(): Observable<Form[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/forms/${this.authenticationService.currentUser?.id}`).pipe(
            map(res => plainToInstance(Form, res))
        );
    }

}
