import { isFunction } from "@js-utilities/typecheck";

import { LoggerOptions, MessageHandler, ProxyTrap } from "../types";
import { getDesign, getTimeToExecMs, isOwnMethod as isOwnM, now } from "../utils";
import { MessageLogger } from "./MessageLogger";
import { MessageConstructor } from "./MessageConstructor";
import { Configuration } from "./Configuration";

export namespace LogHandler {

    export function handleFunction(
        target: object | Function,
        propKey: PropertyKey,
        value: any,
        options?: LoggerOptions,
        isSet?: boolean
    ) {
        return function (...innerArgs: any[]) {
            const preferredOptions = Configuration.getPreferredOptions(this, propKey);
            const start = now();

            const trapResultValue = (() => {
                try {
                    const res = Reflect.apply(value, this, innerArgs);
                    // MDN: In strict mode, a false return value from the "set" handler
                    //      will throw a TypeError exception.
                    // we should avoid this behaviour and return true in any case if target is a setter
                    return isSet || res;
                } catch {
                    return false;
                }
            })();
            const timeToExecMs = getTimeToExecMs(start);

            // simple check instead of "isLogEnabled" is enough here,
            // because there are no traps or special cases produced by this logger method
            if (Configuration.isLogDisabledByDefault(preferredOptions, null)) {
                return trapResultValue;
            }

            const msgMethod = isSet ? ProxyTrap.SET : ProxyTrap.GET;
            MessageLogger.logMessage(preferredOptions, timeToExecMs, MessageConstructor[msgMethod](
                trapResultValue,
                getDesign(this, propKey, innerArgs, trapResultValue, value),
                innerArgs,
                this,
                propKey,
                innerArgs[0]
            ));

            return trapResultValue;
        };
    }

    export function handleTrap(messageHandler: MessageHandler) {
        return function <U extends object>(target: U, trapName: ProxyTrap, descriptor: PropertyDescriptor) {
            const value = descriptor.value;

            descriptor.value = function (...args: any[]) {
                const [argsTarget, argsPropKey, argsInnerArgs] = args;
                let options: LoggerOptions = argsTarget[Configuration.constants.OPTIONS];
                const start = now();
                const trapResultValue = value.apply(target, args);
                const timeToExecMs = getTimeToExecMs(start);
                const isStatic = isFunction(argsTarget);
                const metadataOptions = Reflect.getMetadata(Configuration.constants.OPTIONS, argsTarget, argsPropKey);
                const isProperty = Configuration.isProperty(options, metadataOptions);
                const isStaticProperty = isStatic && isProperty;
                const isOwnMethod = isOwnM(argsTarget, argsPropKey);
                // MDN: In strict mode, a false return value from the "set" handler
                //      will throw a TypeError exception.
                // we should avoid this behaviour and return true in any case if target is a setter
                const trapResultValueToReturn = trapName === ProxyTrap.SET ? true : trapResultValue;

                // available metadataOptions means that property has @Log decorator on it
                if (metadataOptions) {
                    // merge options and metadataOptions,
                    // mark argsPropKey as loggable for this log session
                    options = {
                        ...Configuration.getPreferredOptions(argsTarget, argsPropKey),
                        logProperties: [argsPropKey],
                    };
                    // 1. check if log is disabled
                    // 2. target is static method or get/set, means that
                    //    they'll be logged with decorated descriptors,
                    //    so we should disable log here
                    // 3. the same as p.2, but for non-static method/get/set
                    if (
                        !Configuration.isLogEnabled(options, argsPropKey, trapName as ProxyTrap, isOwnMethod)
                        || (isStatic && !isStaticProperty)
                        || (!isStatic && !isProperty)
                    ) {
                        return trapResultValueToReturn;
                    }
                } else if (!Configuration.isLogEnabled(options, argsPropKey, trapName as ProxyTrap, isOwnMethod)) {
                    return trapResultValueToReturn;
                }

                // means that property is method
                if (isFunction(trapResultValue)) {
                    return function (...innerArgs: any[]) {
                        const trapResultValueCall = trapResultValue.apply(this, innerArgs);

                        MessageLogger.logMessage(options, getTimeToExecMs(start), messageHandler(
                            trapResultValueCall,
                            getDesign(argsTarget, argsPropKey, innerArgs, trapResultValueCall),
                            innerArgs,
                            ...args
                        ));

                        return trapResultValueCall;
                    };
                }

                const isFunc = isFunction(argsTarget);
                const innerArgs = isFunc ? argsInnerArgs : null;
                const prop = isFunc ? null : argsPropKey;
                MessageLogger.logMessage(options, timeToExecMs, messageHandler(
                    trapResultValue,
                    getDesign(argsTarget, prop, innerArgs, trapResultValue),
                    null,
                    ...args
                ));

                return trapResultValueToReturn;
            };

            return descriptor;
        };
    }
}
