import { Design, Message } from "../../../types";
import { Configuration } from "../../Configuration";

export default function (
    result: any,
    design: Design,
    innerArgs: any[],
    target: object,
    property: PropertyKey,
    attributes: PropertyDescriptor
): string[] {
    const SD = Configuration
        .getPreferredOptions(target, property)[Configuration.constants.STRING_DECORATOR];
    const msg: Message = [];

    msg.push(
        SD.getAssembledField(
            `Call ${SD.methodName("defineProperty")} ${SD.fieldLabel("on")}`,
            SD.getLoggerNameString(target)
        ),
        SD.getAssembledField("Property key", SD.propertyName(String(property))),
        SD.getAssembledField("Property descriptor", SD.logObjectProperties(attributes)),
        SD.getAssembledField("Call result", SD.boolean(result))
    );

    msg.extensibleObjects = [
        {
            name: "Property descriptor",
            value: attributes,
        },
    ];

    return msg;
}
