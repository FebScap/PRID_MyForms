import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {SearchService} from "../../services/search.service";

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
    @Input() title: string = '<undefined>';
    @Input() link: string = '/';
    @Input() hasArrowBack: boolean | undefined;
    @Input() hasMenu: boolean | undefined;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private searchService: SearchService,
        private route: ActivatedRoute
    ) {
        if (this.route.snapshot.paramMap.get('link') !== null) {
            this.link = this.route.snapshot.paramMap.get('link') ?? '/';
        }
    }

    get currentUser() {
        return this.authenticationService.currentUser;
    }

    logout() {
        this.authenticationService.logout();
        this.searchService.reset();
        this.router.navigate(['/login']);
    }

    openManageOptionLists() {
        this.router.navigate(['/manage_option_lists']);
    }

    test() {

    }

}