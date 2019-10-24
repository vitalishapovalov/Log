import { Design, Message, ProxyTrap } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object
): string[] {
    const options = Configuration.getPreferredOptions(target);
    const SD = options[Configuration.constants.STRING_DECORATOR];

    const msg: Message = [
        SD.getAssembledField(
            `Call ${SD.methodName("getPrototypeOf")} ${SD.fieldLabel("of")}`,
            SD.getLoggerNameString(target)
        ),
        SD.getAssembledField("Retrieved prototype", SD.unknownType(result, true)),
    ];

    msg.extensibleObjects = [
        {
            name: "Retrieved prototype",
            value: result,
        },
    ];

    msg.logData = {
        target,
        design,
        options,
        trapResult: result,
        proxyTrap: ProxyTrap.GET_PROTOTYPE_OF,
    };

    return msg;
}
