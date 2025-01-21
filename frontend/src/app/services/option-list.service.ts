import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {AuthenticationService} from "./authentication.service";
import {Instance} from "../models/instance";
import {catchError, map} from "rxjs/operators";
import {Answer} from "../models/answer";
import {Form} from "../models/form";
import {OptionList} from "../models/option-list";

@Injectable({ providedIn: 'root' })
export class OptionListService {

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private authenticationService: AuthenticationService) { }

    getById(id: number): Observable<OptionList> {
        return this.http.get<any>(`${this.baseUrl}api/OptionLists/${id}`).pipe(
            map(res => plainToInstance(OptionList, res))
        );
    }

    getAll(): Observable<OptionList[]> {
        return this.http.get<OptionList[]>(`${this.baseUrl}api/OptionLists/`);
    }

    create(optionList: Partial<OptionList>): Observable<OptionList> {
        return this.http.post<OptionList>(`${this.baseUrl}`, optionList);
    }

    update(id: number, optionList: Partial<OptionList>): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}api/OptionLists/${id}`, optionList);
    }

    delete(id: number): Observable<boolean> {
        return this.http.delete<void>(`${this.baseUrl}api/OptionLists/${id}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    getAllForCurrentUser(): Observable<OptionList[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/OptionLists/user/${this.authenticationService.currentUser?.id}`).pipe(
            map(res => plainToInstance(OptionList, res))
        );
    }

    deleteOptionValue(optionListId: number, optionValueId: number): Observable<boolean> {
        return this.http.delete<void>(`${this.baseUrl}api/OptionLists/${optionListId}/values/${optionValueId}`).pipe(
            map(() => true),
            catchError((err) => {
                console.error('Error deleting option value:', err);
                return of(false);
            })
        );
    }

    addOptionValue(optionListId: number, optionValue: { label: string, optionListId: number }): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseUrl}api/OptionLists/${optionListId}/options`, optionValue).pipe(
            map(() => true),
            catchError(err => {
                console.error('Error adding option:', err);
                return of(false);
            })
        );
    }


}
