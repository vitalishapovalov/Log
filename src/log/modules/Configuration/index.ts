import { isArray, isBoolean, isFunction, isString, isUndefined } from "@js-utilities/typecheck";

import { CrossPlatformUtilities, DecoratorType, LoggerOptions, PropTrapValue, ProxyTrap } from "../../types";
import { StringDecorator } from "../StringDecorator";
import * as _frameworks from "./frameworks";
import * as _constants from "./constants";

export namespace Configuration {

    let crossPlatformUtilities: CrossPlatformUtilities | null = null;

    export const constants = _constants;

    export import FRAMEWORKS = _frameworks.FRAMEWORKS;

    export import FrameworkConfigDynamicKey = _frameworks.FrameworkConfigDynamicKey;

    export import FrameworkConfigStaticKey = _frameworks.FrameworkConfigStaticKey;

    export import SupportedFrameworks = _frameworks.SupportedFrameworks;

    export import resolveFrameworkName = _frameworks.resolveFrameworkName;

    export function getPreferredOptions(
        target: object,
        prop: PropertyKey = "",
        alterOptions: LoggerOptions = {}
    ): LoggerOptions {
        const metadataOptions = Reflect.getMetadata(constants.OPTIONS, target, prop as string | symbol)
            || alterOptions || {};
        // if we have target[OPTIONS] defined, we should use'em
        // as general options, and only use defined options from metadataOptions
        // otherwise, fill metadata with missing default options
        const options = Boolean(target[constants.OPTIONS])
            ? { ...target[constants.OPTIONS], ...metadataOptions }
            : getMergedWithDefaults(metadataOptions);

        // case when parent (class) has @Log decorator with defined theme (or not defined),
        // and method's @Log decorator doesn't have theme
        // we should use parents theme, even if it's wasn't defined explicitly
        const shouldUseParentTheme = !((metadataOptions || {}).theme)
            && target[constants.OPTIONS] && target[constants.OPTIONS][constants.STRING_DECORATOR];
        const themeProvider = shouldUseParentTheme ? target[constants.OPTIONS] : metadataOptions;

        // very special case. it means that something went wrong, and we've lost metadata
        // and target's data. instead of failing, create default handlers
        if (!themeProvider) {
            const optsWithTheme = { ...options, theme: constants.DEFAULT_THEME };
            return {
                ...optsWithTheme,
                [constants.STRING_DECORATOR]: new StringDecorator(optsWithTheme),
            };
        }

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
            // frameworks are using different approaches to define hooks/tech props
            // on objects, some approaches are producing additional logs,
            // we should eliminate them
            // 1. log only hooks access, ignore set and getOwnPropertyDescriptor etc.
            if (proxyTrap !== ProxyTrap.GET) return false;
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
            constants.TECH_PARAMETERS.includes(propKey)
        );
    }

    export function getPredictedOptionsName(target: any): string {
        if (
            isFunction(target) ||
            (Boolean(target) && isString(target.name))
        ) return `${target.name}`;
        return null;
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

    export function setCrossPlatformUtilities(newCrossPlatformUtilities: CrossPlatformUtilities): void {
        crossPlatformUtilities = newCrossPlatformUtilities;
    }

    export function getCrossPlatformUtilities(): CrossPlatformUtilities {
        if (!crossPlatformUtilities) {
            throw new Error("trying to get CrossPlatformUtilities but they're not defined");
        }
        return crossPlatformUtilities;
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

        for (const k of Object.getOwnPropertyNames(options[frameworkName])) {
            if (!frameworkConfig[k] || !frameworkConfig[k].includes(propKey)) continue;
            return isLogEnabledForPropKey(options[frameworkName][k], propKey) && (
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
