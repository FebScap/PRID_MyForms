import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {AuthenticationService} from "./authentication.service";
import {Instance} from "../models/instance";
import {map} from "rxjs/operators";
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
        return this.http.get<OptionList[]>(`${this.baseUrl}api/Optionlists`);
    }
}
