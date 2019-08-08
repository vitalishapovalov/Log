import { isBrowser } from "./environment";

// "perf_hooks" is a node.js core module and can't be installed separately
// and we don't need it in bundle
// we will create require fn dynamically to avoid
// resolving "require()" calls by bundlers (webpack etc.)
// we will need this only in node env, so simply mock it with dummy function in browsers
export const requireFunc = isBrowser()
    ? () => void 0
    : eval("require"); // tslint:disable-line:no-eval

export const now = () => (
    isBrowser()
        ? performance.now()
        : requireFunc("perf_hooks").performance.now()
);

export const getTimeToExecMs = (start: number): number => (
    parseFloat((now() - start).toFixed(3))
);

export const toString = (val: any): string => (
    Object.prototype.toString.call(val)
);

export const getUnderlyingPrototype = (obj: object) => (
    Reflect.getPrototypeOf(Reflect.getPrototypeOf(obj))
);

export const isOwnMethod = (target: object, prop: PropertyKey): boolean => {
    const underlyingPrototype = getUnderlyingPrototype(target);
    return underlyingPrototype
        ? Object.prototype.hasOwnProperty.call(underlyingPrototype, prop)
        : true;
};
