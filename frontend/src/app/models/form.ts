import { User } from "./user";

export class Form {
    id: number = 0;
    title: string = '';
    description?: string = '';
    ownerId: number = 0;
    owner: User = new User();
    isPublic: boolean = false;
}

