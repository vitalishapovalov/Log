import { Design, Message } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object,
    args?: any,
    newTarget?: any
): string[] {
    const SD = Configuration
        .getPreferredOptions(target, "constructor")[Configuration.constants.STRING_DECORATOR];
    const msg: Message = [];

    msg.push(SD.getAssembledField(
        `Construct new ${SD.fieldLabel("instance")}`,
        SD.objectLike(result, true)
    ));

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

    return msg;
}
