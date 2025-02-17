import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {plainToInstance} from 'class-transformer';
import {Form} from "../models/form";
import {User} from "../models/user";
import {AuthenticationService} from "./authentication.service";
import {Instance} from "../models/instance";
import {F} from "@angular/cdk/keycodes";

@Injectable({providedIn: 'root'})
export class FormService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private authenticationService: AuthenticationService) {
    }

    getAll(): Observable<Form[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/forms`).pipe(
            map(res => plainToInstance(Form, res))
        );
    }

    getAllPublic(): Observable<Form[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/forms/public`).pipe(
            map(res => plainToInstance(Form, res))
        );
    }

    getAllForCurrentUser(): Observable<Form[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/forms/user/${this.authenticationService.currentUser?.id}`).pipe(
            map(res => plainToInstance(Form, res))
        );
    }

    getById(id: string): Observable<Form> {
        return this.http.get<any>(`${this.baseUrl}api/forms/${id}`).pipe(
            map(res => plainToInstance(Form, res))
        );
    }

    update(form: Form): Observable<boolean> {
        return this.http.put<Form>(`${this.baseUrl}api/forms`, form).pipe(
            map(() => true),
            catchError((err) => {
                console.error(err);
                return of(false);
            })
        );
    }


    deleteById(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/forms/${id}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    createInstance(form: Form) {
        return this.http.get<Instance>(`${this.baseUrl}api/forms/new_instance/${form.id}`).pipe(
            map(res => plainToInstance(Instance, res))
        );
    }

    addForm(formData: Form): Observable<Form> {
        return this.http.post<Form>(`${this.baseUrl}api/forms`, formData).pipe(
            catchError(err => {
                console.error('Error creating form:', err);
                throw err;
            })
        );
    }

    isTitleUnique(title: string, ownerId: string | undefined, currentFormId?: number): Observable<boolean> {
        // Vérification si le propriétaire est bien défini
        if (!ownerId) {
            console.error("Owner ID is not provided");
            return of(false);
        }

        const params: any = { title, ownerId };
        if (currentFormId) {
            params.currentFormId = currentFormId.toString(); // Ajouter l'ID courant si disponible
        }

        return this.http.get<boolean>(`${this.baseUrl}api/forms/is-title-unique`, {
            params
        }).pipe(
            catchError(err => {
                console.error("Error checking title uniqueness:", err);
                return of(false);
            })
        );
    }

    analyze(formId: number, questionId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}api/forms/${formId}/${questionId}/analyze`).pipe(
            map(res => res)
        );
    }
}
