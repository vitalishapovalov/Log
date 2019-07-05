import { Design } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object
): string[] {
    const SD = target[Configuration.constants.OPTIONS][Configuration.constants.STRING_DECORATOR];
    return [
        SD.getAssembledField(
            `Call ${SD.methodName("preventExtensions")} ${SD.fieldLabel("on")}`,
            SD.getLoggerNameString(target)
        ),
        SD.getAssembledField("Result", SD.boolean(result)),
    ];
}
