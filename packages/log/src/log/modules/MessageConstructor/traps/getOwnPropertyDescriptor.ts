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
            `Call ${SD.methodName("getOwnPropertyDescriptor")} ${SD.fieldLabel("on")}`,
            `${SD.string(String(property))}`
        ),
        SD.getAssembledField("Retrieved descriptor", SD.logObjectProperties(result)),
    ];


    msg.extensibleObjects = [
        {
            name: "Retrieved descriptor",
            value: result,
        },
    ];

    msg.logData = {
        proxyTrap: ProxyTrap.GET_OWN_PROPERTY_DESCRIPTOR,
        propertyKey: property,
        target,
        trapResult: result,
        design,
        options,
        descriptor: result,
    };

    return msg;
}
