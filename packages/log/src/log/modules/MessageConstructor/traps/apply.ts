import { Design, LoggerOptions, Message, ProxyTrap } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object,
    thisArg: any,
    args?: any[]
): string[] {
    const options: LoggerOptions = target[Configuration.constants.OPTIONS];
    const SD = options[Configuration.constants.STRING_DECORATOR];

    const message: Message = [
        SD.getAssembledField("Call function", `${
            SD.methodName(String(options.name))}${SD.paramsString(design)}`),
        SD.getAssembledField("Call context", SD.logObjectProperties(thisArg)),
    ];
    message.extensibleObjects = [];

    // log args of args obj exists, even if it has zero length
    if (args) {
        // default args log depth for function arguments is 1
        const logDepth = !!options.argsLogDepth.length
            ? options.argsLogDepth
            : args.map(() => 1);
        message.push(SD.getAssembledField(
            "Call with",
            SD.calledWithString(args, logDepth)
        ));
        message.extensibleObjects.push({
            name: "Call args",
            value: args,
        });
    }

    message.push(SD.getAssembledField("Call result", SD.unknownType(result)));

    if (!!thisArg) {
        message.extensibleObjects.push({
            name: "Context",
            value: thisArg,
        });
    }

    message.logData = {
        target,
        design,
        thisArg,
        args,
        options,
        trapResult: result,
        proxyTrap: ProxyTrap.APPLY,
    };

    return message;
}
