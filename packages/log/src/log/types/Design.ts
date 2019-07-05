export type Design = {
    paramTypes: DesignType[];
    returnType: DesignType;
    type: DesignType;
};

export const enum DesignType {
    ARRAY = "Array",
    BOOLEAN = "Boolean",
    FUNCTION = "Function",
    OBJECT = "Object",
    NUMBER = "Number",
    STRING = "String",
    SYMBOL = "Symbol",
    UNDEFINED = "undefined",
    NULL = "null",
    UNKNOWN = "unknown",
}
