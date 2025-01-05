export enum Type
{
    Short, Long, Date, Email, Integer, Check, Combo, Radio
}

export class Question {
    id: number = 0;
    idX: number = 0;
    title: string = '';
    description?: string = '';
    type: Type = Type.Short;
    required: boolean = false;
    optionList?: number = 0;
}