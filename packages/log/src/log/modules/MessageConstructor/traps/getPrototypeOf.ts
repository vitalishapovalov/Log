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
        SD.getAssembledField(
            `Call ${SD.methodName("getPrototypeOf")} ${SD.fieldLabel("of")}`,
            SD.getLoggerNameString(target)
        ),
        SD.getAssembledField("Retrieved prototype", SD.unknownType(result, true))
    );

    msg.extensibleObjects = [
        {
            name: "Retrieved prototype",
            value: result,
        },
    ];

    return msg;
}
