export enum accessType {
    User = 0, Editor = 1
}
export class Access {
    userId: number = 0;
    accessType: accessType = 0;
}