import { Design } from "./Design";
import { LoggerOptions } from "./Configuration";

export const enum ProxyTrap {
    CONSTRUCT = "construct",
    GET_PROTOTYPE_OF = "getPrototypeOf",
    SET_PROTOTYPE_OF = "setPrototypeOf",
    IS_EXTENSIBLE = "isExtensible",
    PREVENT_EXTENSIONS = "preventExtensions",
    GET_OWN_PROPERTY_DESCRIPTOR = "getOwnPropertyDescriptor",
    HAS = "has",
    GET = "get",
    SET = "set",
    DELETE_PROPERTY = "deleteProperty",
    DEFINE_PROPERTY = "defineProperty",
    OWN_KEYS = "ownKeys",
    APPLY = "apply",
}

export type LogData = {
    proxyTrap: ProxyTrap;
    propertyKey?: PropertyKey;
    trapResult?: any;
    target?: any;
    options?: LoggerOptions;
    message?: string;
    decoratedMessage?: string;
    valueToSet?: any;
    descriptor?: PropertyDescriptor;
    thisArg?: any;
    args?: any[];
    design?: Design;
};
