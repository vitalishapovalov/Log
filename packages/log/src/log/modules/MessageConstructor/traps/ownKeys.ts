import { Design, Message } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object
): string[] {
    const SD = target[Configuration.constants.OPTIONS][Configuration.constants.STRING_DECORATOR];
    const msg: Message = [];

    msg.push(
        SD.getAssembledField("Get own keys of", SD.getLoggerNameString(target)),
        SD.getAssembledField("Result", SD.logArrayProperties(result))
    );

    msg.extensibleObjects = [
        {
            name: "Own keys",
            value: result,
        },
    ];

    return msg;
}
