import { fnToString, isArrowFunctionMatch, isClassMatch, isFunctionMatch, toString } from "./utils";

export const isCallable = (v: any): v is (...args: any[]) => any => {
    if (
        !v
        || (typeof v !== "function" && typeof v !== "object")
        || isClassMatch(fnToString(v))
    ) return false;

    const strV = toString(v);
    return (
        (typeof v === "function" && !v.prototype)
        || strV === "[object Function]"
        || strV === "[object GeneratorFunction]"
    );
};

export const isFunction = (v: any): v is Function => (
    !!v && v instanceof Function && typeof v === "function" && toString(v) === "[object Function]"
);

export const isArrowFunction = (v: any): boolean => {
    const strV = fnToString(v);
    return isCallable(v) && !!strV.length && !isFunctionMatch(strV) && isArrowFunctionMatch(strV);
};

export const isArray = <T = any>(v: any): v is T[] => (
    !!v && (!!Array.isArray ? Array.isArray(v) : toString(v) === "[object Array]")
);

export const isObject = <T = object>(v: any): v is T => (
    !!v && typeof v === "object" || v === Object(v)
);

export const isBoolean = (v: any): v is boolean => (
    typeof v === "boolean" || (toString(v) === "[object Boolean]")
);

export const isUndefined = (v: any): v is undefined => (
    v === void 0
);

export const isNumber = (v: any): v is number => (
    (typeof v === "number" || toString(v) === "[object Number]") && !isNaN(v)
);

export const isString = (v: any): v is string => (
    typeof v === "string" || isObject(v) && (toString(v) === "[object String]")
);

export const isSymbol = (v: any): v is symbol => (
    typeof v === "symbol"
);

export const isNull = (v: any): v is null => (
    v === null
);

export const isMap = <T = any, U = any>(v: any): v is Map<T, U> => (
    v instanceof Map
);

export const isSet = <T = any>(v: any): v is Set<T> => (
    v instanceof Set
);

export const isWeakSet = <T extends object>(v: any): v is WeakSet<T> => (
    v instanceof WeakSet
);

export const isWeakMap = <T extends object, U = any>(v: any): v is WeakMap<T, U> => (
    v instanceof WeakMap
);

export const isPromise = <T = any>(v: any): v is Promise<T> => (
    !!v &&
    (v instanceof Promise
    || (
        (typeof v === "object" || typeof v === "function") && typeof v.then === "function"
    ))
);
