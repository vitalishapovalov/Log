import { isFunction, isNumber, isUndefined } from "@js-utilities/typecheck";

import { Constructor, DecoratorType } from "../types";

export const resolveDecoratorType = (
    target: Object | Constructor,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor | number
): DecoratorType => {
    const isMethodOrPropertyOrGetSet = target.hasOwnProperty("constructor");
    const isClass = isFunction(target) && isUndefined(propertyKey) && isUndefined(descriptor);
    // when using Babel, he gives us "initializer" function
    // on property descriptor of class instance field instead of "value" key.
    const isProperty = isMethodOrPropertyOrGetSet && (
        isUndefined(descriptor)
        || descriptor && isFunction((descriptor as any).initializer)
    );
    const isMethod = isMethodOrPropertyOrGetSet && !!descriptor && descriptor.hasOwnProperty("value");
    const isParameter = isMethodOrPropertyOrGetSet && isNumber(descriptor);
    const isGetSet = isMethodOrPropertyOrGetSet
        && !isProperty
        && !isMethod
        && !isParameter;

    const isStaticMethod = isFunction(target) && !!descriptor && descriptor.hasOwnProperty("value");
    // when using Babel, he gives us "initializer" function
    // on property descriptor of class instance field instead of "value" key.
    const isStaticProperty = isFunction(target) && (
        isUndefined(descriptor)
        || descriptor && isFunction((descriptor as any).initializer)
    );
    const isStaticParameter = isFunction(target) && isNumber(descriptor);
    const isStaticGetSet = isFunction(target)
        && !isStaticMethod
        && !isStaticProperty
        && !isStaticParameter;

    if (isClass) return DecoratorType.CLASS;
    if (isGetSet) return DecoratorType.GETSET;
    if (isMethod) return DecoratorType.METHOD;
    if (isProperty) return DecoratorType.PROPERTY;
    if (isParameter) return DecoratorType.PARAMETER;
    if (isStaticGetSet) return DecoratorType.STATIC_GETSET;
    if (isStaticMethod) return DecoratorType.STATIC_METHOD;
    if (isStaticProperty) return DecoratorType.STATIC_PROPERTY;
    if (isStaticParameter) return DecoratorType.STATIC_PARAMETER;

    return null;
};
