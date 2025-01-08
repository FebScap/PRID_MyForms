import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {catchError, map} from 'rxjs/operators';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {plainToInstance} from 'class-transformer';
import {Form} from "../models/form";
import {User} from "../models/user";
import {AuthenticationService} from "./authentication.service";
import {Instance} from "../models/instance";
import {FormGroup} from "@angular/forms";

@Injectable({providedIn: 'root'})
export class AddFormService {
    private addFormSource = new BehaviorSubject<Form>(new Form());
    public addForm = this.addFormSource.asObservable();
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private authenticationService: AuthenticationService) {
    }
    
    setForm(form: Form) {
        this.addFormSource.next(form);
    }
    
    reset() {
        this.addFormSource.next(new Form());
    }
    
}
