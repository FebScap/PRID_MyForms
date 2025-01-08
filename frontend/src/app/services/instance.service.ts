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
export class InstanceService {
    
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private authenticationService: AuthenticationService) { }
    
    getById(id: string): Observable<Instance> {
        return this.http.get<any>(`${this.baseUrl}api/instances/${id}`).pipe(
            map(res => plainToInstance(Instance, res))
        );
    }
    
    getAnswers(instanceId: number): Observable<Answer[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/instances/${instanceId}/answers`).pipe(
            map(res => plainToInstance(Answer, res))
        );
    }
}
