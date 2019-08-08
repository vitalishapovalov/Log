import { Design, Message, ProxyTrap } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object,
    prototype: any
): string[] {
    const options = Configuration.getPreferredOptions(target);
    const SD = options[Configuration.constants.STRING_DECORATOR];
    const res = Boolean(result) ? "succeed" : "failed";

    const msg: Message = [
        SD.getAssembledField(
            `Call ${SD.methodName("setPrototypeOf")} ${SD.fieldLabel("on")}`,
            SD.getLoggerNameString(target)
        ),
        SD.getAssembledField(`Set ${res}`, SD.unknownType(prototype, true)),
    ];

    msg.extensibleObjects = [
        {
            name: "Set prototype",
            value: prototype,
        },
    ];

    msg.logData = {
        proxyTrap: ProxyTrap.SET,
        target,
        trapResult: result,
        design,
        options,
        valueToSet: prototype,
    };

    return msg;
}
