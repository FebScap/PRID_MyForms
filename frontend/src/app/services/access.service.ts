import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {AuthenticationService} from "./authentication.service";

@Injectable({providedIn: 'root'})
export class AccessService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private authenticationService: AuthenticationService) {
    }

    getAccesses(formId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/${formId}/accesses`);
    }

    addAccess(formId: number, access: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/${formId}/accesses`, access);
    }

    updateAccess(formId: number, userId: number, access: any): Observable<void> {
        return this.http.put<void>(
            `${this.baseUrl}/${formId}/accesses/${userId}`,
            access
        );
    }

    deleteAccess(formId: number, userId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.baseUrl}/${formId}/accesses/${userId}`
        );
    }
}
