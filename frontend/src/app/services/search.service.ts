import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {BehaviorSubject} from 'rxjs';
import {Form} from "../models/form";
import {AuthenticationService} from "./authentication.service";
import {Answer} from "../models/answer";

@Injectable({providedIn: 'root'})
export class SearchService {
    private filter = "";
    private isSearchBarVisibleSource = new BehaviorSubject<boolean>(false);
    public isSearchBarVisible = this.isSearchBarVisibleSource.asObservable();
    
    constructor() {
    }

    setSearch(s: string) {
        this.filter = s;
    }

    reset() {
        this.filter = "";
        this.isSearchBarVisibleSource.next(false);
    }

    getSearchString() {
        return this.filter;
    }
    
    getSearchBarVisibility() {
        return this.isSearchBarVisibleSource.getValue();
    }
    
    setSearchBarVisibility(b: boolean) {
        this.isSearchBarVisibleSource.next(b);
    }

}
