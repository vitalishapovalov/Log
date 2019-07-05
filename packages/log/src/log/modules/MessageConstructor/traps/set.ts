import { isFunction, isSymbol } from "@js-utilities/typecheck";

import { Design, DesignType, Message } from "../../../types";
import { resolveDesignType } from "../../../utils";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object,
    property: PropertyKey,
    value: any
): string[] {
    const msg: Message = [];
    const preferredOptions = Configuration.getPreferredOptions(target, property);
    const MD = preferredOptions[Configuration.constants.STRING_DECORATOR];
    const staticPrefix = isFunction(target) ? "static " : "";
    // normally, get/set won't have a descriptor, and property - will
    const isSetter = !Boolean(Object.getOwnPropertyDescriptor(target, property));
    const prop = isSetter ? MD.methodName(String(property)) : MD.propertyName(String(property));
    const propIsSymbol = isSymbol(property);
    const logDepth: number = (
        // parameter decorator has highest priority
        Reflect.getMetadata(Configuration.constants.PARAMS_LOG_DEPTH, target, property as string | symbol)
        // take property / instance option
        || (Array.isArray(preferredOptions.argsLogDepth) && preferredOptions.argsLogDepth)
        // none resolved
        || []
        // taking only first arg as setters normally have only 1 param
        // default log depth for get / set is 2, set if none is resolved
    )[0] || 2;

    // if no design available, resolve it here
    if (design.type === DesignType.UNDEFINED || design.type === DesignType.UNKNOWN) {
        design.type = resolveDesignType(value);
    }

    const designType = MD.type(
        isSetter && design.paramTypes && design.paramTypes[0]
            ? design.paramTypes[0]
            : design.type
    );
    const propType = isSetter ? "" : `: ${designType};`;
    const setProperty = isSetter
        ? `set ${prop}(${MD.otherText("arg")}: ${designType})${propType};`
        : `${prop}: ${designType};`;

    msg.push(
        MD.getAssembledField(`Set ${staticPrefix}${propIsSymbol ? "symbol" : "property"}`, setProperty),
        MD.getAssembledField(
            `Set ${Boolean(result) ? "succeed" : "failed"}`,
            `${prop} = ${MD.unknownType(value, true, logDepth)};`
        )
    );

    msg.extensibleObjects = [
        {
            value,
            name: "Set value",
        },
    ];

    return msg;
}
