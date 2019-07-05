import { Design, Message } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object,
    property: PropertyKey
): string[] {
    const SD = Configuration.getPreferredOptions(target, property)[Configuration.constants.STRING_DECORATOR];
    const msg: Message = [];

    msg.push(
        SD.getAssembledField(
            `Call ${SD.methodName("getOwnPropertyDescriptor")} ${SD.fieldLabel("on")}`,
            `${SD.string(String(property))}`
        ),
        SD.getAssembledField("Retrieved descriptor", SD.logObjectProperties(result))
    );

    msg.extensibleObjects = [
        {
            name: "Retrieved descriptor",
            value: result,
        },
    ];

    return msg;
}
