import { Design } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object,
    property: PropertyKey
): string[] {
    const SD = Configuration.getPreferredOptions(target, property)[Configuration.constants.STRING_DECORATOR];
    return [
        SD.getAssembledField(
            `Access in ${SD.fieldLabel("operator")}`,
            `${SD.string(String(property))} in ${SD.getLoggerNameString(target)}`
        ),
        SD.getAssembledField("Access result", SD.boolean(result)),
    ];
}
