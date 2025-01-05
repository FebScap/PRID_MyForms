import {Type} from "@angular/core";

export enum Role {
    Admin=2,
    User=1,
    Guest=0
}

export class User {
    id: number = 0;
    email?: string = '';
    password?: string = '';
    firstName: string = '';
    lastName: string = '';
    role: Role = Role.User;
    birthDate: Date = new Date();
    token?: string;
    refreshToken?: string;

    public get roleAsString(): string {
        return Role[this.role];
    }
}