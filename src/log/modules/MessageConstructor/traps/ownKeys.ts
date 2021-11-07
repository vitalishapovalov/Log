import { Design, Message, ProxyTrap } from "../../../types";
import { Configuration } from "../../Configuration";
import { TECH_PARAMETERS } from "../../Configuration/constants";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object
): string[] {
    const options = Configuration.getPreferredOptions(target);
    const SD = options[Configuration.constants.STRING_DECORATOR];

    const ownKeysWithoutTechParams = Array.isArray(result)
        ? result.filter((ownKey: PropertyKey) => !TECH_PARAMETERS.includes(ownKey))
        : result;
    const msg: Message = [
        SD.getAssembledField("Get own keys of", SD.getLoggerNameString(target)),
        SD.getAssembledField("Result", SD.logArrayProperties(ownKeysWithoutTechParams)),
    ];

    msg.extensibleObjects = [
        {
            name: "Own keys",
            value: result,
        },
    ];

    msg.logData = {
        target,
        design,
        options,
        trapResult: result,
        proxyTrap: ProxyTrap.OWN_KEYS,
    };

    return msg;
}
