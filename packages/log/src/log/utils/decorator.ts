import { isFunction, isNumber, isUndefined } from "@js-utilities/typecheck";

import { Constructor, DecoratorType } from "../types";

export const resolveDecoratorType = (
    target: Object | Constructor,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor | number
): DecoratorType => {
    const isMethodOrPropertyOrAccessor = target.hasOwnProperty("constructor");
    const isClass = isFunction(target) && isUndefined(propertyKey) && isUndefined(descriptor);
    // when using Babel, he gives us "initializer" function
    // on property descriptor of class instance field instead of "value" key.
    const isProperty = isMethodOrPropertyOrAccessor && (
        isUndefined(descriptor)
        || descriptor && isFunction((descriptor as any).initializer)
    );
    const isMethod = isMethodOrPropertyOrAccessor && !!descriptor && descriptor.hasOwnProperty("value");
    const isParameter = isMethodOrPropertyOrAccessor && isNumber(descriptor);
    const isAccessor = isMethodOrPropertyOrAccessor
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
    const isStaticAccessor = isFunction(target)
        && !isStaticMethod
        && !isStaticProperty
        && !isStaticParameter;

    if (isClass) return DecoratorType.CLASS;
    if (isAccessor) return DecoratorType.ACCESSOR;
    if (isMethod) return DecoratorType.METHOD;
    if (isProperty) return DecoratorType.PROPERTY;
    if (isParameter) return DecoratorType.PARAMETER;
    if (isStaticAccessor) return DecoratorType.STATIC_ACCESSOR;
    if (isStaticMethod) return DecoratorType.STATIC_METHOD;
    if (isStaticProperty) return DecoratorType.STATIC_PROPERTY;
    if (isStaticParameter) return DecoratorType.STATIC_PARAMETER;

    return null;
};
