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
    
    deleteById(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/Instances/${id}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
    
    deleteAll(formId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/instances/delete-all/${formId}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
    
    deleteSelected(ids: number[]): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseUrl}api/instances/delete-selected`, ids).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
    
    update(instance: Instance): Observable<Instance> {
        return this.http.put<any>(`${this.baseUrl}api/instances`, instance).pipe(
            map(res => plainToInstance(Instance, res))
        );
    }
    
}
