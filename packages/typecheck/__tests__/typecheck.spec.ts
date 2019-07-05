import {
    isCallable,
    isFunction,
    isArrowFunction,
    isArray,
    isObject,
    isString,
    isNumber,
    isSet,
    isBoolean,
    isSymbol,
    isMap,
    isNull,
    isUndefined,
    isWeakMap,
    isWeakSet
} from "../src";

describe("typecheck test", () => {

    it("should correctly check that value is a callable entity", () => {
        expect(isCallable(() => {})).toBeTruthy();
        expect(isCallable(new Function)).toBeTruthy();
        expect(isCallable(function() { })).toBeTruthy();
        expect(isCallable(function*() { })).toBeTruthy();

        expect(isCallable({ })).toBeFalsy();
        expect(isCallable("")).toBeFalsy();
        expect(isCallable(null)).toBeFalsy();
        expect(isCallable(undefined)).toBeFalsy();
    });

    it("should correctly check that value is a function", () => {
        expect(isFunction(() => {})).toBeTruthy();
        expect(isFunction(new Function)).toBeTruthy();
        expect(isFunction(function() { })).toBeTruthy();

        expect(isFunction({ })).toBeFalsy();
        expect(isFunction("")).toBeFalsy();
        expect(isFunction(null)).toBeFalsy();
        expect(isFunction(undefined)).toBeFalsy();
    });

    it("should correctly check that value is an arrow function", () => {
        expect(isArrowFunction(() => {})).toBeTruthy();

        expect(isArrowFunction(new Function)).toBeFalsy();
        expect(isArrowFunction(function() { })).toBeFalsy();
        expect(isArrowFunction(function*() { })).toBeFalsy();

        expect(isArrowFunction({ })).toBeFalsy();
        expect(isArrowFunction("")).toBeFalsy();
        expect(isArrowFunction(null)).toBeFalsy();
        expect(isArrowFunction(undefined)).toBeFalsy();
    });

    it("should correctly check that value is an array", () => {
        const nativeIsArray = Array.isArray;

        Array.isArray = undefined;
        expect(isArray([])).toBeTruthy();
        expect(isArray(new Array)).toBeTruthy();
        expect(isArray(Array())).toBeTruthy();

        Array.isArray = nativeIsArray;
        expect(isArray([])).toBeTruthy();
        expect(isArray(new Array)).toBeTruthy();
        expect(isArray(Array())).toBeTruthy();

        expect(isArray({})).toBeFalsy();
        expect(isArray(1)).toBeFalsy();
        expect(isArray("")).toBeFalsy();
        expect(isArray(null)).toBeFalsy();
        expect(isArray(undefined)).toBeFalsy();
    });

    it("should correctly check that value is an object", () => {
        expect(isObject({})).toBeTruthy();
        expect(isObject(new Object)).toBeTruthy();

        expect(isObject(1)).toBeFalsy();
        expect(isObject("")).toBeFalsy();
        expect(isObject(null)).toBeFalsy();
        expect(isObject(undefined)).toBeFalsy();
    });

    it("should correctly check that value is a string", () => {
        expect(isString("")).toBeTruthy();
        expect(isString("test")).toBeTruthy();
        expect(isString(new String)).toBeTruthy();
        expect(isString(new String("test"))).toBeTruthy();

        expect(isString(1)).toBeFalsy();
        expect(isString({ })).toBeFalsy();
        expect(isString(new Function)).toBeFalsy();
        expect(isString(() => {})).toBeFalsy();
        expect(isString(null)).toBeFalsy();
        expect(isString(undefined)).toBeFalsy();
    });

    it("should correctly check that value is a number", () => {
        expect(isNumber(0)).toBeTruthy();
        expect(isNumber(0x1)).toBeTruthy();
        expect(isNumber(100)).toBeTruthy();
        expect(isNumber(1_000)).toBeTruthy();
        expect(isNumber(1.100)).toBeTruthy();
        expect(isNumber(new Number(0))).toBeTruthy();
        expect(isNumber(new Number(1))).toBeTruthy();

        expect(isNumber("")).toBeFalsy();
        expect(isNumber({ })).toBeFalsy();
        expect(isNumber(new Function)).toBeFalsy();
        expect(isNumber(() => {})).toBeFalsy();
        expect(isNumber(null)).toBeFalsy();
        expect(isNumber(undefined)).toBeFalsy();
    });

    it("should correctly check that value is a Set", () => {
        expect(isSet(new Set())).toBeTruthy();

        expect(isSet(1)).toBeFalsy();
        expect(isSet(new WeakSet())).toBeFalsy();
        expect(isSet("")).toBeFalsy();
        expect(isSet([])).toBeFalsy();
        expect(isSet({ })).toBeFalsy();
        expect(isSet(null)).toBeFalsy();
        expect(isSet(undefined)).toBeFalsy();
    });

    it("should correctly check that value is a Boolean", () => {
        expect(isBoolean(true)).toBeTruthy();
        expect(isBoolean(false)).toBeTruthy();
        expect(isBoolean(new Boolean)).toBeTruthy();
        expect(isBoolean(Boolean(1))).toBeTruthy();

        expect(isBoolean(1)).toBeFalsy();
        expect(isBoolean("")).toBeFalsy();
        expect(isBoolean({ })).toBeFalsy();
        expect(isBoolean(new Function)).toBeFalsy();
        expect(isBoolean(() => {})).toBeFalsy();
        expect(isBoolean(null)).toBeFalsy();
        expect(isBoolean(undefined)).toBeFalsy();
    });

    it("should correctly check that value is a Symbol", () => {
        expect(isSymbol(Symbol())).toBeTruthy();
        expect(isSymbol(Symbol("1"))).toBeTruthy();
        expect(isSymbol(Symbol.for("1"))).toBeTruthy();

        expect(isSymbol(1)).toBeFalsy();
        expect(isSymbol("")).toBeFalsy();
        expect(isSymbol({ })).toBeFalsy();
        expect(isSymbol(new Function)).toBeFalsy();
        expect(isSymbol(() => {})).toBeFalsy();
        expect(isSymbol(null)).toBeFalsy();
        expect(isSymbol(undefined)).toBeFalsy();
    });

    it("should correctly check that value is a Map", () => {
        expect(isMap(new Map())).toBeTruthy();

        expect(isMap(1)).toBeFalsy();
        expect(isMap(new Set())).toBeFalsy();
        expect(isMap("")).toBeFalsy();
        expect(isMap([])).toBeFalsy();
        expect(isMap({ })).toBeFalsy();
        expect(isMap(null)).toBeFalsy();
        expect(isMap(undefined)).toBeFalsy();
    });

    it("should correctly check that value is a null", () => {
        expect(isNull(null)).toBeTruthy();

        expect(isNull(0)).toBeFalsy();
        expect(isNull("")).toBeFalsy();
        expect(isNull([])).toBeFalsy();
        expect(isNull({ })).toBeFalsy();
        expect(isNull(undefined)).toBeFalsy();
    });

    it("should correctly check that value is an undefined", () => {
        expect(isUndefined(undefined)).toBeTruthy();

        expect(isUndefined(0)).toBeFalsy();
        expect(isUndefined("")).toBeFalsy();
        expect(isUndefined([])).toBeFalsy();
        expect(isUndefined({ })).toBeFalsy();
        expect(isUndefined(null)).toBeFalsy();
    });

    it("should correctly check that value is a WeakMap", () => {
        expect(isWeakMap(new WeakMap())).toBeTruthy();

        expect(isWeakMap(1)).toBeFalsy();
        expect(isWeakMap(new WeakSet())).toBeFalsy();
        expect(isWeakMap("")).toBeFalsy();
        expect(isWeakMap([])).toBeFalsy();
        expect(isWeakMap({ })).toBeFalsy();
        expect(isWeakMap(null)).toBeFalsy();
        expect(isWeakMap(undefined)).toBeFalsy();
    });

    it("should correctly check that value is a WeakSet", () => {
        expect(isWeakSet(new WeakSet())).toBeTruthy();

        expect(isWeakSet(1)).toBeFalsy();
        expect(isWeakSet(new Set())).toBeFalsy();
        expect(isWeakSet("")).toBeFalsy();
        expect(isWeakSet([])).toBeFalsy();
        expect(isWeakSet({ })).toBeFalsy();
        expect(isWeakSet(null)).toBeFalsy();
        expect(isWeakSet(undefined)).toBeFalsy();
    });
});
