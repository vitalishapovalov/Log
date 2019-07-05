import { Design } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object,
    property: PropertyKey
): string[] {
    const SD = Configuration
        .getPreferredOptions(target, property)[Configuration.constants.STRING_DECORATOR];
    return [
        SD.getAssembledField(
            `Access delete ${SD.fieldLabel("operator")}`,
            `delete ${SD.objectLike(target, true)}[${SD.string(property as string)}];`
        ),
        SD.getAssembledField("Delete result", SD.boolean(result)),
    ];
}
