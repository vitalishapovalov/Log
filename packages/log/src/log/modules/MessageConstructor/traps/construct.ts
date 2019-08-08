import { Design, Message, ProxyTrap } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object,
    args?: any,
    newTarget?: any
): string[] {
    const options = Configuration.getPreferredOptions(target, "constructor");
    const SD = options[Configuration.constants.STRING_DECORATOR];

    const msg: Message = [
        SD.getAssembledField(
            `Construct new ${SD.fieldLabel("instance")}`,
            SD.objectLike(result, true)
        ),
    ];

    if (innerArgs && innerArgs.length) {
        msg.push(SD.getAssembledField(
            "Construct arguments",
            SD.calledWithString(innerArgs, innerArgs.map(() => 1))
        ));
    }

    msg.extensibleObjects = [
        {
            name: "Constructed instance",
            value: result,
        },
    ];

    msg.logData = {
        proxyTrap: ProxyTrap.CONSTRUCT,
        target,
        trapResult: result,
        design,
        args,
        options,
    };

    return msg;
}
