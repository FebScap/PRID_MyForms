import {User} from "./user";

export class Instance {
    id: number = 0;
    userId: number = 0;
    user: User = new User();
    formId: number = 0;
    started: Date = new Date();
    completed: Date = new Date();
}

