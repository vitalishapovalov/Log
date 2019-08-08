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
        SD.getAssembledField("Get own keys of", SD.getLoggerNameString(target)),
        SD.getAssembledField("Result", SD.logArrayProperties(result)),
    ];

    msg.extensibleObjects = [
        {
            name: "Own keys",
            value: result,
        },
    ];

    msg.logData = {
        proxyTrap: ProxyTrap.OWN_KEYS,
        target,
        trapResult: result,
        design,
        options,
    };

    return msg;
}
