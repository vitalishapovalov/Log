export interface Constructor {
    new(...args: any[]): {};
}

export const enum Accessor {
    GET = "get",
    SET = "set",
}

export type KeysArray = (string | number | symbol | Symbol)[]
    | readonly (string | number | symbol | Symbol)[];

export type PropTrapValue = boolean | KeysArray;
