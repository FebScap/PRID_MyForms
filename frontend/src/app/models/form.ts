import {Type} from "@angular/core";
import {UserService} from "../services/user.service";

export class Form {
    id: number = 0;
    title: string = '';
    description?: string = '';
    ownerId: number = 0;
    isPublic: boolean = false;
}

