import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {BehaviorSubject} from 'rxjs';
import {Form} from "../models/form";
import {AuthenticationService} from "./authentication.service";

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
    
    getForm() {
        return this.addFormSource.value;
    }
    
}
