import { isArray, isBoolean, isFunction, isNumber, isObject, isString, isSymbol } from "@js-utilities/typecheck";

import { Design, DesignType } from "../types";

export const resolveDesignType = (value: any): DesignType => {
    switch (true) {
        case isFunction(value): return DesignType.FUNCTION;
        case isBoolean(value): return DesignType.BOOLEAN;
        case isNumber(value): return DesignType.NUMBER;
        case isString(value): return DesignType.STRING;
        case isArray(value): return DesignType.ARRAY;
        case isObject(value): return DesignType.OBJECT;
        case isSymbol(value): return DesignType.SYMBOL;
        case null === value: return DesignType.NULL;
        case undefined === value: return DesignType.UNDEFINED;
        default: return DesignType.UNKNOWN;
    }
};

export const getDesign = <T extends object>(
    target: T,
    prop: keyof T,
    innerArgs?: any[],
    result?: any,
    value?: any
): Design => {
    return {
        paramTypes: resolveParamTypes(target, prop, innerArgs, value),
        returnType: resolveReturnType(target, prop, result),
        type: resolveType(target, prop, value),
    };
};

function resolveReturnType<T extends object>(target: T, prop: keyof T, result: any): DesignType {
    if (isObject(prop)) return;
    const typeMetadata = Reflect.getMetadata("design:returntype", target, prop as any);
    return typeMetadata ? typeMetadata.name as DesignType : resolveDesignType(result);
}

function resolveType<T extends object>(target: T, prop: keyof T, value: any): DesignType {
    if (isObject(prop)) return;
    const typeMetadata = Reflect.getMetadata("design:type", target, prop as any);
    return typeMetadata ? typeMetadata.name as DesignType : resolveDesignType(value || target[prop]);
}

function resolveParamTypes<T extends object>(target: T, prop: keyof T, args: any[], value: any): DesignType[] {
    const val = value || target[prop];
    if (!isFunction(target) && (isObject(prop) || !isFunction(val))) return;
    const wrappedArgs = Array.isArray(args) ? args : [args];
    const paramTypesMetadata = Reflect.getMetadata("design:paramtypes", target, prop as any);
    // if no metadata available, resolve design types based on arguments
    const paramTypes = (paramTypesMetadata && paramTypesMetadata.map(p => p.name))
                    || (wrappedArgs && wrappedArgs.map(resolveDesignType));
    const func = isFunction(target) ? target : val as any;
    return paramTypes || Array(func.length).fill(DesignType.UNKNOWN);
}
