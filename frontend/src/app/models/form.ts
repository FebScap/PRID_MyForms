import { User } from "./user";
import {Instance} from "./instance";
import { Access } from "./access";

export class Form {
    id: number = 0;
    title: string = '';
    description?: string = '';
    ownerId: number = 0;
    owner: User = new User();
    isPublic: boolean = false;
    instances: Instance[] = [];
    accesses: Access[] = [];
}

