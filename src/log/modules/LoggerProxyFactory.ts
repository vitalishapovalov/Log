import { isFunction } from "@js-utilities/typecheck";

import { Constructor, Accessor, LoggerOptions, ProxyTrap } from "../types";
import { getOwnClassName } from "../utils/other";
import { MessageLogger } from "./MessageLogger";
import { MessageConstructor } from "./MessageConstructor";
import { LoggerProxy } from "./LoggerProxy";
import { LogHandler } from "./LogHandler";
import { Configuration } from "./Configuration";

export namespace LoggerProxyFactory {

    export function ofClass<T extends Constructor>(constructor: T, options: LoggerOptions): T {
        return class __$$LoggerProxy extends constructor {
            public constructor(...args: any[]) {
                const start = Configuration.getCrossPlatformUtilities().now();
                super(...args);
                const timeToExecMs = Configuration.getCrossPlatformUtilities().getTimeToExecMs(start);

                const completeOptions: LoggerOptions = {
                    ...getOptionsWithFallbackName(this, options),
                    // this feature is used to disable logging in derived classes,
                    // but currently disabled and should be re-implemented
                    [Configuration.constants.IS_SUBCLASS]: false,
                };
                // if no framework detected during initialization,
                // try to define it here
                if (!completeOptions[Configuration.constants.FRAMEWORK_NAME]) {
                    completeOptions[Configuration.constants.FRAMEWORK_NAME] =
                        Configuration.resolveFrameworkName(this, options);
                }
                const proxyObj = ofEntity(this, completeOptions);

                const logEnabled =
                    Configuration.isLogEnabled(completeOptions, null, ProxyTrap.CONSTRUCT, true);
                if (logEnabled && options.logConstructor) {
                    MessageLogger.logMessage(
                        completeOptions,
                        timeToExecMs,
                        MessageConstructor[ProxyTrap.CONSTRUCT](this, null, args, this)
                    );
                }

                return proxyObj;
            }
        };
    }

    export function ofMethod(
        target: object | Function,
        propertyKey: PropertyKey,
        descriptor: PropertyDescriptor,
        options: LoggerOptions
    ): PropertyDescriptor {
        applyOptionsMetadata(target, propertyKey, options);

        const value = descriptor.value;
        descriptor.value = LogHandler.handleFunction(
            target,
            propertyKey,
            value,
            getOptionsWithFallbackName(target, options)
        );

        return descriptor;
    }

    export function ofProperty(target: object, propertyKey: PropertyKey, options: LoggerOptions) {
        applyOptionsMetadata(target, propertyKey, options);
    }

    export function ofAccessor(
        target: object | Function,
        propertyKey: PropertyKey,
        descriptor: PropertyDescriptor,
        options: LoggerOptions
    ) {
        applyOptionsMetadata(target, propertyKey, options);

        // property can have get/set or both declared
        // if any is declared, log it
        for (const accessor of [Accessor.GET, Accessor.SET]) {
            if (!isFunction(descriptor[accessor])) continue;
            const value = descriptor[accessor];
            descriptor[accessor] = LogHandler.handleFunction(
                target,
                propertyKey,
                value,
                getOptionsWithFallbackName(target, options),
                accessor
            );
        }

        return descriptor;
    }

    export function ofParameter(
        target: object,
        propertyKey: PropertyKey,
        index: number,
        loggerOptions: LoggerOptions
    ): void {
        const PARAMS_LOG_DEPTH = Configuration.constants.PARAMS_LOG_DEPTH;
        const logDepth: number[] =
            Reflect.getOwnMetadata(PARAMS_LOG_DEPTH, target, propertyKey as string | symbol) || [];

        // for the moment, the only reason to put @Log on a parameter is to log it deeply
        // so at lease lvl 1 depth should be set
        logDepth[index] = loggerOptions[PARAMS_LOG_DEPTH][0] || 1;

        Reflect.defineMetadata(PARAMS_LOG_DEPTH, logDepth, target, propertyKey as string | symbol);
    }

    export function ofEntity<T extends Object>(entity: T, options: LoggerOptions): T {
        Object.defineProperty(entity, Configuration.constants.OPTIONS, {
            value: options,
            configurable: false,
            enumerable: false,
            writable: true,
        });

        if (options.provideLogger) {
            Object.defineProperty(entity, Configuration.constants.INSTANCE_LOGGER_NAME, {
                value: MessageLogger.createInstanceMessageLogger(options),
                configurable: false,
                enumerable: false,
                writable: false,
            });
        }

        return LoggerProxy.create<T>(entity);
    }

    function getOptionsWithFallbackName(target: object, options: LoggerOptions): LoggerOptions {
        // if no name provided, try to use an existing options name or a constructor name
        const fallbackName = target[Configuration.constants.OPTIONS]
            || (target && getOwnClassName(target))
            || {};
        return {
            ...options,
            name: options.name || fallbackName.name,
        };
    }

    function applyOptionsMetadata(target: object, property: PropertyKey, options: LoggerOptions): void {
        // define options as metadata on target's property key
        // to be able to retrieve and use it during logging
        Reflect.defineMetadata(
            Configuration.constants.OPTIONS,
            getOptionsWithFallbackName(target, options),
            target,
            property as string | symbol
        );
    }
}
