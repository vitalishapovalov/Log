import { FrameworkConfig, LoggerTheme, LoggerOptions } from "../../types";
import { SupportedFrameworks } from "./frameworks";

export const SEPARATOR = "@" as const;

export const OPTIONS: unique symbol = Symbol("OPTIONS");

export const PARAMS_LOG_DEPTH: unique symbol = Symbol("PARAMS_LOG_DEPTH");

export const STRING_DECORATOR: unique symbol = Symbol("STRING_DECORATOR");

export const DECORATOR_TYPE: unique symbol = Symbol("DECORATOR_TYPE");

export const IS_SUBCLASS: unique symbol = Symbol("IS_SUBCLASS");

export const FRAMEWORK_NAME: unique symbol = Symbol("FRAMEWORK_NAME");

export const PROMISE_FAILED: unique symbol = Symbol("PROMISE_FAILED");

export const DEFAULT_LINE_HEIGHT = "20px" as const;

export const INSTANCE_LOGGER_NAME = "logger" as const;

export const TECH_PARAMETERS: readonly PropertyKey[] = Object.freeze([
    OPTIONS,
    INSTANCE_LOGGER_NAME,
]);

export const DEFAULT_OPTIONS: Readonly<LoggerOptions> = (() => {
    const opts: LoggerOptions = {
        name: "",
        log: true,
        consoleMethod: "log",
        loggerOptions: {
            logTimeStamp: true,
            logSuffix: true,
        },
        logExtensibleObjects: false,
        provideLogger: false,
        logName: true,
        logProperties: true,
        logInvocation: true,
        logPropertiesFull: false,
        logConstructor: false,
        logGetPrototypeOf: false,
        logSetPrototypeOf: false,
        logIsExtensible: false,
        logPreventExtensions: false,
        logGetOwnPropertyDescriptor: false,
        logInOperator: false,
        logDeleteProperty: false,
        logDefineProperty: false,
        logOwnKeys: false,
        logWellKnownSymbols: false,
        logProtoMethods: false,
        logExecutionTime: false,
        logTimeStamp: false,
        argsLogDepth: [],
        [PARAMS_LOG_DEPTH]: [],
        [DECORATOR_TYPE]: 0,
    };
    for (const f in SupportedFrameworks) {
        opts[SupportedFrameworks[f]] = { argsLogDepth: 1 } as FrameworkConfig;
    }
    return Object.freeze(opts);
})();

export const DARK_THEME: Readonly<LoggerTheme> = Object.freeze({
    comma: [195, 115, 49],
    delete: [195, 115, 49],
    arrow: [255, 255, 255],
    dot: [255, 255, 255],
    eq: [255, 255, 255],
    new: [195, 115, 49],
    colon: [255, 255, 255],
    semicolon: [195, 115, 49],
    propertyName: [148, 115, 164],
    methodName: [246, 192, 106],
    function: [195, 115, 49],
    static: [195, 115, 49],
    type: [169, 183, 198],
    loggerName: [195, 115, 49],
    executionTime: [104, 151, 187],
    executionTimeMs: [195, 115, 49],
    background: [43, 43, 43],
    fieldLabel: [255, 255, 255],
    fieldSeparator: [180, 180, 180],
    otherText: [255, 255, 255],
    bound: [246, 192, 106],
    number: [104, 151, 187],
    boolean: [195, 115, 49],
    string: [106, 134, 89],
    objectLike: [195, 115, 49],
    null: [195, 115, 49],
    undefined: [195, 115, 49],
    in: [195, 115, 49],
    parentheses: [255, 255, 255],
    brackets: [255, 255, 255],
    squareBrackets: [255, 255, 255],
    timeStamp: [255, 255, 255],
    succeed: [87, 146, 66],
    failed: [168, 65, 58],
    accessor: [195, 115, 49],
    hook: [97, 218, 251],
    error: [168, 65, 58],
    info: [104, 151, 187],
    warn: [246, 192, 106],
    log: [255, 255, 255],
});

export const LIGHT_THEME: Readonly<LoggerTheme> = Object.freeze({
    comma: [0, 0, 0],
    delete: [0, 0, 128],
    arrow: [0, 0, 0],
    dot: [0, 0, 0],
    eq: [0, 0, 0],
    new: [0, 0, 128],
    colon: [0, 0, 0],
    semicolon: [0, 0, 0],
    propertyName: [102, 14, 122],
    methodName: [122, 122, 67],
    function: [0, 0, 128],
    static: [0, 0, 128],
    type: [69, 131, 131],
    loggerName: [0, 0, 128],
    executionTime: [44, 44, 255],
    executionTimeMs: [0, 0, 128],
    background: [244, 244, 244],
    fieldLabel: [0, 0, 0],
    fieldSeparator: [39, 44, 52],
    otherText: [0, 0, 0],
    bound: [122, 122, 67],
    number: [44, 44, 255],
    boolean: [0, 0, 128],
    string: [0, 128, 0],
    objectLike: [0, 0, 128],
    null: [0, 0, 128],
    undefined: [0, 0, 128],
    in: [0, 0, 128],
    parentheses: [0, 0, 0],
    brackets: [0, 0, 0],
    squareBrackets: [0, 0, 0],
    timeStamp: [0, 0, 0],
    succeed: [0, 155, 0],
    failed: [155, 0, 0],
    accessor: [0, 0, 128],
    hook: [97, 218, 251],
    error: [155, 0, 0],
    info: [44, 44, 255],
    warn: [246, 192, 106],
    log: [0, 0, 0],
});

export const DEFAULT_THEME: Readonly<LoggerTheme> = DARK_THEME;

export const WELL_KNOWN_SYMBOLS: readonly Symbol[] = Object.freeze([
    Symbol.asyncIterator,
    Symbol.hasInstance,
    Symbol.isConcatSpreadable,
    Symbol.iterator,
    Symbol.match,
    Symbol["matchAll"],
    Symbol.prototype,
    Symbol.replace,
    Symbol.search,
    Symbol.species,
    Symbol.split,
    Symbol.toPrimitive,
    Symbol.toStringTag,
    Symbol.unscopables,
]);

export const PROTO_METHODS: readonly string[] = Object.freeze([
    "prototype",
    "apply",
    "call",
    "bind",
    ...Object.getOwnPropertyNames(Object.prototype),
    ...Object.getOwnPropertyNames(Array.prototype),
    ...Object.getOwnPropertyNames(Map.prototype),
    ...Object.getOwnPropertyNames(Set.prototype),
    ...Object.getOwnPropertyNames(WeakMap.prototype),
    ...Object.getOwnPropertyNames(WeakSet.prototype),
    ...Object.getOwnPropertyNames(Symbol.prototype),
    ...Object.getOwnPropertyNames(Number.prototype),
    ...Object.getOwnPropertyNames(String.prototype),
    ...Object.getOwnPropertyNames(Boolean.prototype),
    ...Object.getOwnPropertyNames(RegExp.prototype),
]);
