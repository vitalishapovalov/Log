import { Design, Message, ProxyTrap } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object,
    property: PropertyKey
): string[] {
    const options = Configuration.getPreferredOptions(target, property);
    const SD = options[Configuration.constants.STRING_DECORATOR];

    const msg: Message = [
        SD.getAssembledField(
            `Access delete ${SD.fieldLabel("operator")}`,
            `delete ${SD.objectLike(target, true)}[${SD.string(property as string)}];`
        ),
        SD.getAssembledField("Delete result", SD.boolean(result)),
    ];

    msg.logData = {
        proxyTrap: ProxyTrap.DELETE_PROPERTY,
        propertyKey: property,
        target,
        trapResult: result,
        design,
        options,
    };

    return msg;
}
