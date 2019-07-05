import { Design, Message } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object,
    prototype: any
): string[] {
    const SD = target[Configuration.constants.OPTIONS][Configuration.constants.STRING_DECORATOR];
    const res = Boolean(result) ? "succeed" : "failed";
    const msg: Message = [];

    msg.push(
        SD.getAssembledField(
            `Call ${SD.methodName("setPrototypeOf")} ${SD.fieldLabel("on")}`,
            SD.getLoggerNameString(target)
        ),
        SD.getAssembledField(`Set ${res}`, SD.unknownType(prototype, true))
    );

    msg.extensibleObjects = [
        {
            name: "Set prototype",
            value: prototype,
        },
    ];

    return msg;
}
