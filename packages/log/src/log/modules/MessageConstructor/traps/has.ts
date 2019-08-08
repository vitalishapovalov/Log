import { Design, Message, ProxyTrap } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object,
    property: PropertyKey
): string[] {
    const options = Configuration.getPreferredOptions(target, property);
    const SD = options[Configuration.constants.STRING_DECORATOR];

    const msg: Message = [
        SD.getAssembledField(
            `Access in ${SD.fieldLabel("operator")}`,
            `${SD.string(String(property))} in ${SD.getLoggerNameString(target)}`
        ),
        SD.getAssembledField("Access result", SD.boolean(result)),
    ];

    msg.logData = {
        proxyTrap: ProxyTrap.HAS,
        propertyKey: property,
        target,
        trapResult: result,
        design,
        options,
    };

    return msg;
}
