import { isBoolean, isFunction, isUndefined, isArray } from "@js-utilities/typecheck";

import { Constructor, DecoratorType, LoggerOptions, PropTrapValue, ProxyTrap } from "../../types";
import { getUnderlyingPrototype } from "../../utils";
import * as _frameworks from "./frameworks";
import * as _constants from "./constants";

export namespace Configuration {

    export const constants = _constants;

    export import FRAMEWORKS = _frameworks.FRAMEWORKS;

    export import FrameworkConfigDynamicKey = _frameworks.FrameworkConfigDynamicKey;

    export import FrameworkConfigStaticKey = _frameworks.FrameworkConfigStaticKey;

    export import SupportedFrameworks = _frameworks.SupportedFrameworks;

    export import resolveFrameworkName = _frameworks.resolveFrameworkName;

    export function getPreferredOptions(target: object, prop: PropertyKey): LoggerOptions {
        const metadataOptions = Reflect.getMetadata(constants.OPTIONS, target, prop as string | symbol);
        // if we have target[OPTIONS] defined, we should use'em
        // as general options, and only use defined options from metadataOptions
        // otherwise, fill metadata with missing default options
        const options = Boolean(target[constants.OPTIONS])
            ? { ...target[constants.OPTIONS], ...(metadataOptions || {}) }
            : getMergedWithDefaults(metadataOptions);

        // case when parent (class) has @Log decorator with defined theme (or not defined),
        // and method's @Log decorator doesn't have theme
        // we should use parents theme, even if it's not defined
        const shouldUseParentTheme = !((metadataOptions || {}).theme)
            && target[constants.OPTIONS] && target[constants.OPTIONS][constants.STRING_DECORATOR];
        const themeProvider = shouldUseParentTheme ? target[constants.OPTIONS] : metadataOptions;

        return {
            ...options,
            theme: themeProvider.theme,
            [constants.STRING_DECORATOR]: themeProvider[constants.STRING_DECORATOR],
        };
    }

    export function getMergedWithDefaults(options: LoggerOptions = {}): LoggerOptions {
        const mergedOptions = {
            ...constants.DEFAULT_OPTIONS,
            ...options,
            loggerOptions: { ...constants.DEFAULT_OPTIONS.loggerOptions, ...options.loggerOptions },
        };
        for (const f in _frameworks.SupportedFrameworks) {
            const fw = _frameworks.SupportedFrameworks[f];
            if (options[fw]) {
                mergedOptions[fw] = { ...constants.DEFAULT_OPTIONS[fw], ...options[fw] };
            }
        }
        return mergedOptions;
    }

    export function isLogEnabled(
        options: LoggerOptions,
        propKey: PropertyKey,
        proxyTrap: ProxyTrap,
        isOwnMethod: boolean
    ): boolean {
        if (isLogDisabledByDefault(options, propKey)) return false;

        const isPropTrap = isPropertyHook(proxyTrap);
        if (isPropTrap
            && isArray(options.logPropertiesFull)
            && options.logPropertiesFull.includes(propKey)) return true;

        if (isFrameworkProperty(options, propKey)) {
            return isShouldLogFrameworkProperty(options, propKey, isOwnMethod);
        }

        const isWellKnownSymbol = constants.WELL_KNOWN_SYMBOLS.includes(propKey as symbol);
        const isObjectProtoMethod = constants.PROTO_METHODS.includes(propKey as string);
        if (isPropTrap
            && !(isWellKnownSymbol || isObjectProtoMethod)
            && isBoolean(options.logPropertiesFull)
            && options.logPropertiesFull) return true;

        const trapOption = getTrapOption(proxyTrap);
        if (isPropTrap) {
            const option: PropTrapValue = isWellKnownSymbol
                ? options.logWellKnownSymbols
                : isObjectProtoMethod
                    ? options.logProtoMethods
                    : options[trapOption] as PropTrapValue;
            return isLogEnabledForPropKey(option, propKey);
        }

        return options[trapOption] as boolean;
    }

    export function isLogDisabledByDefault(options: LoggerOptions, propKey: PropertyKey): boolean {
        return (
            !options.log ||
            constants.TECH_PARAMETERS.includes(propKey) ||
            (isFunction(options.condition) && options.condition(propKey))
        );
    }

    export function getPredictedOptionsName(target: any): string {
        if (isFunction(target)) return `${target.name}`;
        return null;
    }

    export function isLoggerSubclass(context: object, constructor: Constructor): boolean {
        const underlyingProtoConstructor = getUnderlyingPrototype(context).constructor;

        return underlyingProtoConstructor !== constructor
            // avoid cases when decorated class extends native constructors
            && !(underlyingProtoConstructor === Object);
    }

    export function isProperty(...options: LoggerOptions[]): boolean {
        return (
            options.filter(Boolean).reduce(
                (acc, { [constants.DECORATOR_TYPE]: decoratorType }) => (
                    acc || (decoratorType === DecoratorType.PROPERTY || decoratorType === DecoratorType.STATIC_PROPERTY)
                ),
                false
            )
        );
    }

    export function notOptionPredicate(value: any): boolean {
        return value !== _constants.OPTIONS;
    }

    function isFrameworkProperty(options: LoggerOptions, propKey: PropertyKey): boolean {
        const fwName = options[constants.FRAMEWORK_NAME];
        if (!fwName) return false;

        for (const k in _frameworks.FrameworkConfigDynamicKey) {
            if (_frameworks.FRAMEWORKS[fwName][_frameworks.FrameworkConfigDynamicKey[k]].includes(propKey)) return true;
        }

        return false;
    }

    function isShouldLogFrameworkProperty(
        options: LoggerOptions,
        propKey: PropertyKey,
        isOwnMethod: boolean
    ): boolean {
        const frameworkName = options[constants.FRAMEWORK_NAME];
        const frameworkConfig = _frameworks.FRAMEWORKS[frameworkName];
        for (const k of Reflect.ownKeys(options[frameworkName])) {
            if (!frameworkConfig[k] || !frameworkConfig[k].includes(propKey)) continue;
            return isLogEnabledForPropKey(options.react[k], propKey) && (
                isOwnMethod
                || frameworkConfig.isLogDesirable(propKey)
            );
        }
        return false;
    }

    function isPropertyHook(proxyTrap: ProxyTrap): boolean {
        switch (proxyTrap) {
            case ProxyTrap.DEFINE_PROPERTY:
            case ProxyTrap.DELETE_PROPERTY:
            case ProxyTrap.GET:
            case ProxyTrap.GET_OWN_PROPERTY_DESCRIPTOR:
            case ProxyTrap.SET:
            case ProxyTrap.HAS:
                return true;
            default:
                return false;
        }
    }

    function getTrapOption(proxyTrap: ProxyTrap): keyof LoggerOptions {
        switch (proxyTrap) {
            case ProxyTrap.DEFINE_PROPERTY:
                return "logDefineProperty";
            case ProxyTrap.DELETE_PROPERTY:
                return "logDeleteProperty";
            case ProxyTrap.GET:
                return "logProperties";
            case ProxyTrap.GET_OWN_PROPERTY_DESCRIPTOR:
                return "logGetOwnPropertyDescriptor";
            case ProxyTrap.SET:
                return "logProperties";
            case ProxyTrap.HAS:
                return "logInOperator";
            case ProxyTrap.APPLY:
                return "logInvocation";
            case ProxyTrap.CONSTRUCT:
                return "logConstructor";
            case ProxyTrap.GET_PROTOTYPE_OF:
                return "logGetPrototypeOf";
            case ProxyTrap.IS_EXTENSIBLE:
                return "logIsExtensible";
            case ProxyTrap.OWN_KEYS:
                return "logOwnKeys";
            case ProxyTrap.PREVENT_EXTENSIONS:
                return "logPreventExtensions";
            case ProxyTrap.SET_PROTOTYPE_OF:
                return "logSetPrototypeOf";
        }
    }

    function isLogEnabledForPropKey(option: PropTrapValue, propKey: PropertyKey): boolean {
        if (isUndefined(option)) return false;
        if (isBoolean(option)) return option;
        if (Array.isArray(option)) return option.includes(propKey);
        return false;
    }
}
