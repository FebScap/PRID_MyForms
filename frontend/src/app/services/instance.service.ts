import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {AuthenticationService} from "./authentication.service";
import {Instance} from "../models/instance";
import {map} from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class InstanceService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private authenticationService: AuthenticationService) { }
    
    getById(id: string): Observable<Instance> {
        return this.http.get<any>(`${this.baseUrl}api/instances/${id}`).pipe(
            map(res => plainToInstance(Instance, res))
        );
    }
}
