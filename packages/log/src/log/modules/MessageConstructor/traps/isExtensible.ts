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
            `Check ${SD.methodName("isExtensible")} ${SD.fieldLabel("of")}`,
            SD.getLoggerNameString(target)
        ),
        SD.getAssembledField("Result", SD.boolean(result)),
    ];

    msg.logData = {
        proxyTrap: ProxyTrap.IS_EXTENSIBLE,
        target,
        trapResult: result,
        design,
        options,
    };

    return msg;
}
