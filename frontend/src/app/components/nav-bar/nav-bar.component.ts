import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {Role} from "../../models/user";

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
    @Input() title: string = '<undefined>';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    get currentUser() {
        return this.authenticationService.currentUser;
    }
    
    get currentPath() {
        return this.router.url;
    }

    get isAdmin() {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }

    get isGuest() {
        return this.currentUser && this.currentUser.role === Role.Guest;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
