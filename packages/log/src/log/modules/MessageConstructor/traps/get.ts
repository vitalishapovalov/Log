import { isFunction, isSymbol } from "@js-utilities/typecheck";

import { DecoratorType, Design, DesignType, Message } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object | Function,
    property: PropertyKey
): string[] {
    const preferredOptions = Configuration.getPreferredOptions(target, property);
    const SD = preferredOptions[Configuration.constants.STRING_DECORATOR];
    const fwName = preferredOptions[Configuration.constants.FRAMEWORK_NAME];
    const message: Message = [];
    const descriptor = Reflect.getOwnPropertyDescriptor(target, property);
    const isStatic = isFunction(target);
    // when using Babel, he gives us "initializer" function
    // on property descriptor of class instance field instead of "value" key.
    const isProperty = Boolean(descriptor) && ("value" in descriptor || "initializer" in descriptor);
    const staticPrefix = isStatic ? "static " : "";
    const propIsSymbol = isSymbol(property);
    const metadataOptions = Reflect.getMetadata(Configuration.constants.OPTIONS, target, property as string | symbol);
    const isHook = !!fwName && Configuration.FRAMEWORKS[fwName].isHook(property);
    const isMethod = design.type === DesignType.FUNCTION
        // instance/static get/set will also have FUNCTION type,
        // but we can detect them only with metadataOptions available
        && (!metadataOptions || (
            metadataOptions[Configuration.constants.DECORATOR_TYPE] !== DecoratorType.GETSET &&
            metadataOptions[Configuration.constants.DECORATOR_TYPE] !== DecoratorType.STATIC_GETSET
        ));
    let isStaticProperty = isStatic && Configuration.isProperty(target[Configuration.constants.OPTIONS], metadataOptions);

    message.extensibleObjects = [];

    if (isStatic) {
        // design resolved incorrectly for static getters
        if (design.type === DesignType.UNDEFINED) {
            design.type = design.returnType;
        }
        // if static property didn't had @Log decorator on it, it won't have
        // OPTIONS object with corresponding decorator type, so we're
        // accessing underlying property descriptor, to detect prop type (prop/get/set)
        if (!isMethod && !isProperty && !isStaticProperty) {
            const innerDescriptor =
                Reflect.getOwnPropertyDescriptor(Reflect.getPrototypeOf(target), property);
            isStaticProperty = Boolean(innerDescriptor) && Boolean(innerDescriptor.value);
        }
    }

    const isGetSet = !isMethod && !isProperty && !isStaticProperty;
    const label = isHook
        ? `${staticPrefix}${SD.hook}`
        : isMethod
            ? `Call ${staticPrefix}${SD.methodName("method")}`
            : `Access ${staticPrefix}${propIsSymbol ? "symbol" : "property"}`;
    const resultLabel = `${isMethod ? "Call" : "Access"} result`;
    const propName = (() => {
        switch (true) {
            case (isGetSet):
                return SD.getSetString("get", SD.methodName(String(property)), design.returnType);
            case (isMethod):
                return `${SD.methodName(String(property))}${SD.paramsString(design, isHook ? 1 : 3)}`;
            case (isProperty):
            case (isStaticProperty):
                return `${SD.propertyName(String(property))}: ${SD.type(design.type)};`;
            default: SD.otherText(String(property));
        }
    })();
    message.push(SD.getAssembledField(label, propName));

    if (isProperty || isStaticProperty || isMethod || isGetSet) {
        message.extensibleObjects.push({
            name: resultLabel,
            value: result,
        });
    }

    if (design.paramTypes && design.paramTypes.length && innerArgs && innerArgs.length) {
        const logDepth: number[] =
            // parameter decorator has highest priority
            Reflect.getMetadata(Configuration.constants.PARAMS_LOG_DEPTH, target, property as string | symbol)
            // if property is framework hook - take specific option
            // for now only React is supported
            || ((isHook || (fwName && Configuration.FRAMEWORKS[fwName].isLogDesirable(property)))
                && Array(innerArgs.length).fill(preferredOptions.react.argsLogDepth))
            // take property / instance argsLogDepth option, lowest priority
            || (Array.isArray(preferredOptions.argsLogDepth) && preferredOptions.argsLogDepth)
            // do not log members of object-like values
            || [];
        message.push(SD.getAssembledField(
            "Call with",
            SD.calledWithString(innerArgs, logDepth)
        ));
        message.extensibleObjects.push({
            name: "Call with",
            value: innerArgs,
        });
    }

    // if prop is hook we don't always want to see its return value
    // e.g. "componentDidMount" in React, which always returns "undefined"
    const shouldLogResult = !(Boolean(fwName) && Configuration.FRAMEWORKS[fwName].includes(property))
        || Configuration.FRAMEWORKS[fwName].shouldLogReturnValue(property);
    if (shouldLogResult) {
        message.push(SD.getAssembledField(
            resultLabel,
            // default log depth for call results is 1.
            SD.unknownType(result, true, 1)
        ));
    }

    return message;
}
