import { Log } from "../../src/node";

@Log
export class T {
    public prop: string = "prop_value";
    public get getSetProp() { return "getter_getSetProp"; }
    public set getSetProp(val: string) {}
    public method() { return "method_value"; }
}

@Log({ logConstructor: true })
export class TConstructor {
    public constructor(...args: any[]) {}
}

@Log({ logGetPrototypeOf: true })
export class TGetPrototypeOf {
    dummy() { return "dummy_value"; }
}

@Log({ logSetPrototypeOf: true })
export class TSetPrototypeOf {
    dummy() { return "dummy_value"; }
}

@Log({ logIsExtensible: true })
export class TIsExtensible {}

@Log({ logPreventExtensions: true })
export class TPreventExtensions {}

@Log({ logOwnKeys: true })
export class TOwnKeys {
    public key1: number = 1;
    public key2: number = 2;
}

@Log({ logPropertiesFull: ["prop"] })
export class TLogFullProperty {
    public prop: string = "prop_value";
}

@Log
export class TFunction extends Function {}

@Log({ provideLogger: true })
export class TProvideLogger {}

export class TMethod {
    @Log
    myMethod(a) {
        return a;
    }

    @Log("NamedMethod")
    myNamedMethod(a, b) {
        return a + b;
    }
}
