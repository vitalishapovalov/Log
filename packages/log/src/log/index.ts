import { isNumber, isString } from "@js-utilities/typecheck";

import { Constructor, DecoratorType, LoggerOptions } from "./types";
import { resolveDecoratorType } from "./utils";
import { Configuration } from "./modules/Configuration";
import { StringDecorator } from "./modules/StringDecorator";
import { LoggerProxyFactory } from "./modules/LoggerProxyFactory";

// tslint:disable-next-line:function-name
export function Log(
    target: LoggerOptions | string | number | Function | object,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor | number
): ClassDecorator | MethodDecorator | PropertyDecorator | any {
    const targetIsLogDepth: boolean = isNumber(target);
    const targetIsNameOption: boolean = isString(target);
    const targetIsLoggerOptions: boolean = !resolveDecoratorType(target, propertyKey, descriptor);

    if (targetIsLoggerOptions || targetIsNameOption || targetIsLogDepth) {
        return logDecorator;
    }
    return logDecorator(target, propertyKey, descriptor);

    function logDecorator(
        innerTarget: Object | Constructor,
        innerPropertyKey?: string | symbol,
        innerDescriptor?: PropertyDescriptor | number
    ) {
        const decoratorType = resolveDecoratorType(innerTarget, innerPropertyKey, innerDescriptor);
        // reduce different options variations to an object
        const options: LoggerOptions = targetIsNameOption
            ? { name: target as string }
            : targetIsLogDepth
                ? { [Configuration.constants.PARAMS_LOG_DEPTH]: [target as number] }
                : targetIsLoggerOptions
                    ? target as LoggerOptions
                    : {};
        // if target isn't a class, we suppose that target's owner class has @Log decorator
        // with merged-in default options and they will be used as defaults.
        // if target's owner class doesn't have @Log, default options will be merged in logtime
        const optionsWithDefaults: LoggerOptions = decoratorType === DecoratorType.CLASS
            ? Configuration.getMergedWithDefaults(options)
            : options;
        const preparedOptions: LoggerOptions = {
            ...optionsWithDefaults,
            name: optionsWithDefaults.name || Configuration.getPredictedOptionsName(target),
            [Configuration.constants.DECORATOR_TYPE]: decoratorType,
            [Configuration.constants.FRAMEWORK_NAME]: Configuration.resolveFrameworkName(innerTarget),
            [Configuration.constants.STRING_DECORATOR]: new StringDecorator(optionsWithDefaults),
        };

        switch (decoratorType) {
            case DecoratorType.CLASS:
                return LoggerProxyFactory.ofClass(
                    innerTarget as Constructor,
                    preparedOptions
                );
            case DecoratorType.PROPERTY:
            case DecoratorType.STATIC_PROPERTY:
                return LoggerProxyFactory.ofProperty(
                    innerTarget,
                    innerPropertyKey,
                    preparedOptions
                );
            case DecoratorType.METHOD:
            case DecoratorType.STATIC_METHOD:
                return LoggerProxyFactory.ofMethod(
                    innerTarget,
                    innerPropertyKey,
                    innerDescriptor as PropertyDescriptor,
                    preparedOptions
                );
            case DecoratorType.GETSET:
            case DecoratorType.STATIC_GETSET:
                return LoggerProxyFactory.ofGetSet(
                    innerTarget,
                    innerPropertyKey,
                    innerDescriptor as PropertyDescriptor,
                    preparedOptions
                );
            case DecoratorType.PARAMETER:
            case DecoratorType.STATIC_PARAMETER:
                return LoggerProxyFactory.ofParameter(
                    innerTarget,
                    innerPropertyKey,
                    innerDescriptor as number,
                    preparedOptions
                );
            case null:
                console.error(
                    "Incorrect @Log usage, decorator type can't be resolved." + "\n" +
                    "Consider using it on a class, method, property or a parameter."
                );
        }
    }
}

export function log<T = Function | object>(target: T, options: LoggerOptions | string = {}): T {
    // if string provided instead of options obj, means it's shorthand for options.name
    const resolvedOptions = isString(options) ? { name: options } : options;
    const optionsWithDefaults = Configuration.getMergedWithDefaults(resolvedOptions);

    return LoggerProxyFactory.ofEntity(target, {
        ...optionsWithDefaults,
        // special minimum args log depth for function entities
        name: optionsWithDefaults.name || Configuration.getPredictedOptionsName(target),
        [Configuration.constants.DECORATOR_TYPE]: DecoratorType.UNKNOWN,
        [Configuration.constants.FRAMEWORK_NAME]: Configuration.resolveFrameworkName(target as unknown as object),
        [Configuration.constants.STRING_DECORATOR]: new StringDecorator(optionsWithDefaults),
    });
}
