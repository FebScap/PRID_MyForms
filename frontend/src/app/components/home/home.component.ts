import {Component} from '@angular/core';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";

@Component({
    selector: 'templateProject',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    users?: User[];

    constructor(private userService: UserService) {
        this.userService.getAll().subscribe((res) => this.users = res)
    }
}