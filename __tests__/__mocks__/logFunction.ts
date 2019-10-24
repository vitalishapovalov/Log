import { log } from "../../src/log";

export const getTObject = () => log({
    prop: "prop_value",
    get getSet() {
        return "getSet_value";
    },
    set getSet(val: string) {},
    method() {
        return "method_value";
    }
});

export const getTFunction = () => log(function TFunction (a: any, b: any) {
    return "value";
});
