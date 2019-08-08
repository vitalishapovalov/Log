import { RGB } from "./Colors";
import { DecoratorType } from "./Decorator";
import { Design } from "./Design";
import { Configuration } from "../modules/Configuration";
import { StringDecorator } from "../modules/StringDecorator";

export type LoggerOptions = {

    /**
     * Name of the logger.
     * All messages will be prepended with this field's value.
     *
     * @default function or class name
     */
    name?: string | number;

    /**
     * Flag for enabling/disabling Logger name logging.
     *
     * @default true
     */
    logName?: boolean;

    /**
     * If provided, will be executed on each log.
     * If condition isn't met, log won't be executed.
     *
     * @default undefined
     */
    condition?: (propKey: PropertyKey) => boolean;

    /**
     * Console method which will be used to output messages.
     *
     * @default "log"
     */
    consoleMethod?: "log" | "group" | "groupCollapsed" | "groupEnd" | "warn" | "info";

    /**
     * Logger theme. If object will be provided, "dark" will be used as main theme
     * and overridden with provided object properties.
     *
     * @default "dark"
     */
    theme?: "dark" | "light" | LoggerTheme;

    /**
     * InstanceMessageLogger description can be found in Instance logger section of readme.
     *
     * @default false
     */
    provideLogger?: boolean;

    /**
     * InstanceMessageLogger description can be found in Instance logger section of readme.
     *
     * @default { logTimeStamp: true, logSuffix: true }
     */
    loggerOptions?: InstanceMessageLoggerOptions;

    /**
     * Flag for enabling/disabling logging.
     *
     * @default true
     */
    log?: boolean;

    /**
     * The same as "logProperties", but for all types of the property manipulation.
     * (e.g. "prop" in class, delete class["prop"], getOwnPropertyDescriptor)
     *
     * @default false
     */
    logPropertiesFull?: boolean | PropertyKey[];

    /**
     * Some object just can't fit into well-looking console output,
     * so you can force logger to log full objects separately
     * right after the log message.
     *
     * @default false
     */
    logExtensibleObjects?: boolean;

    /**
     * Option to control "toString()", "valueOf()" and other well-known calls.
     *
     * @default false
     */
    logWellKnownSymbols?: boolean | Symbol[];

    /**
     * Option to control "hasOwnProperty" and other Object.prototype calls.
     *
     * @default false
     */
    logProtoMethods?: boolean | string[];

    /**
     * Will append execution time (of method call etc.) raw to every log message.
     * In browser: Performance API, in Node.js - "perf_hooks" core module.
     *
     * @default false
     */
    logExecutionTime?: boolean;

    /**
     * Add timestamp for each log message.
     *
     * @default true
     */
    logTimeStamp?: boolean;

    /**
     * Alternative for @Log parameter decorator.
     * Array of depth log for each argument.
     *
     * If you want to set log depth 5 only for the second parameter:
     * argsLogDepth: [null, 5]
     *
     * @default []
     */
    argsLogDepth?: (number | null | undefined)[];

    /**
     * Log class constructing.
     *
     * @default false
     */
    logConstructor?: boolean;

    /**
     * Log getPrototypeOf calls to the class.
     *
     * @default false
     */
    logGetPrototypeOf?: boolean;

    /**
     * Log setPrototypeOf calls to the class.
     *
     * @default false
     */
    logSetPrototypeOf?: boolean;

    /**
     * Log isExtensible calls to the class.
     *
     * @default false
     */
    logIsExtensible?: boolean;

    /**
     * Log preventExtensions calls to the class.
     *
     * @default false
     */
    logPreventExtensions?: boolean;

    /**
     * A list of properties (or boolean to affect all of them),
     * whose accessing/setting/calling will be logged.
     *
     * @default true
     */
    logProperties?: boolean | PropertyKey[];

    /**
     * A list of properties (or boolean to affect all of them),
     * whose getOwnPropertyDescriptor calls will be logged.
     *
     * @default false
     */
    logGetOwnPropertyDescriptor?: boolean | PropertyKey[];

    /**
     * A list of properties (or boolean to affect all of them),
     * whose "prop in Obj" checks will be logged.
     *
     * @default false
     */
    logInOperator?: boolean | PropertyKey[];

    /**
     * A list of properties (or boolean to affect all of them),
     * whose "delete prop" executions will be logged.
     *
     * @default false
     */
    logDeleteProperty?: boolean | PropertyKey[];

    /**
     * A list of properties (or boolean to affect all of them),
     * whose defineProperty calls will be logged.
     *
     * @default false
     */
    logDefineProperty?: boolean | PropertyKey[];

    /**
     * A list of properties (or boolean to affect all of them),
     * whose defineProperty calls will be logged.
     *
     * @default false
     */
    logOwnKeys?: boolean;

    /**
     * Log entity invocation (usually a function, but also
     * might be a class extending Function).
     *
     * @default true
     */
    logInvocation?: boolean;

    // technical
    [Configuration.constants.IS_SUBCLASS]?: boolean;
    [Configuration.constants.FRAMEWORK_NAME]?: string;
    [Configuration.constants.DECORATOR_TYPE]?: DecoratorType;
    [Configuration.constants.PARAMS_LOG_DEPTH]?: number[];
    [Configuration.constants.STRING_DECORATOR]?: StringDecorator;
} & {
    // frameworks support
    [Framework in Configuration.SupportedFrameworks]?: FrameworkConfig;
};

export type FrameworkConfig = {
    [Key in Configuration.FrameworkConfigDynamicKey]?: boolean | string[] | readonly string[];
} & {
    [Configuration.FrameworkConfigStaticKey.ARGS_LOG_DEPTH]?: number;
};

export type FrameworkInterface = Readonly<{
    [Key in Configuration.FrameworkConfigDynamicKey]: readonly PropertyKey[];
}> & {
    includes(str: PropertyKey): boolean;
    isHook(str: PropertyKey): boolean;
    isLogDesirable(str: PropertyKey): boolean;
    shouldLogReturnValue(str: PropertyKey): boolean;
};

export interface InstanceMessageLogger {
    info(msg: string, ...args: any[]): void;
    warn(msg: string, ...args: any[]): void;
    log(msg: string, ...args: any[]): void;
    error(msg: string, ...args: any[]): void;
}

export type InstanceMessageLoggerOptions = {
    logName?: boolean;
    logTimeStamp?: boolean;
    logMs?: boolean;
    logSuffix?: boolean | string;
};

export type LoggerTheme = {
    comma: RGB;
    arrow: RGB;
    delete: RGB;
    dot: RGB;
    eq: RGB;
    new: RGB;
    colon: RGB;
    semicolon: RGB;
    in: RGB;
    propertyName: RGB;
    function: RGB;
    static: RGB;
    methodName: RGB;
    type: RGB;
    loggerName: RGB;
    executionTime: RGB;
    executionTimeMs: RGB;
    background: RGB;
    fieldLabel: RGB;
    fieldSeparator: RGB;
    otherText: RGB;
    bound: RGB;
    number: RGB;
    boolean: RGB;
    string: RGB;
    objectLike: RGB;
    null: RGB;
    undefined: RGB;
    parentheses: RGB;
    brackets: RGB;
    squareBrackets: RGB;
    timeStamp: RGB;
    succeed: RGB;
    failed: RGB;
    accessor: RGB;
    hook: RGB;
    // InstanceMessageLogger methods
    error: RGB;
    info: RGB;
    warn: RGB;
    log: RGB;
};

export type Message = string[] & {
    extensibleObjects?: ExtensibleObject[];
};

export interface MessageHandler {
    (result: any, design: Design, innerArgs?: any[], ...args: any[]): Message;
}

export type ExtensibleObject = {
    name: string;
    value: object;
};
