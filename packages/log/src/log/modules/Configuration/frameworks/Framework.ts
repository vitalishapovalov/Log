import { FrameworkInterface } from "../../../types";

export enum SupportedFrameworks {
    REACT = "react",
    NEST = "nest",
    VUE = "vue",
}

export enum FrameworkConfigStaticKey {
    ARGS_LOG_DEPTH = "argsLogDepth",
}

export enum FrameworkConfigDynamicKey {
    TECHNICAL = "logTechnical",
    STATE = "logState",
    PROPS = "logProps",
    HOOKS = "logHooks",
    REFS = "logRefs",
    CONTEXT = "logContext",
    OTHER = "logOther",
}

export default abstract class Framework implements FrameworkInterface {

    includes(str: PropertyKey): boolean {
        const props = [];
        for (const k in FrameworkConfigDynamicKey) props.push(...this[FrameworkConfigDynamicKey[k]]);
        return props.includes(str);
    }

    isHook(str: PropertyKey): boolean {
        return this[FrameworkConfigDynamicKey.HOOKS].includes(str);
    }

    abstract isFrameworkComponent(context: object): boolean;
    abstract isLogDesirable(str: PropertyKey): boolean;
    abstract shouldLogReturnValue(str: PropertyKey): boolean;

    abstract [FrameworkConfigDynamicKey.TECHNICAL]: readonly PropertyKey[];
    abstract [FrameworkConfigDynamicKey.HOOKS]: readonly PropertyKey[];
    abstract [FrameworkConfigDynamicKey.STATE]: readonly PropertyKey[];
    abstract [FrameworkConfigDynamicKey.PROPS]: readonly PropertyKey[];
    abstract [FrameworkConfigDynamicKey.REFS]: readonly PropertyKey[];
    abstract [FrameworkConfigDynamicKey.CONTEXT]: readonly PropertyKey[];
    abstract [FrameworkConfigDynamicKey.OTHER]: readonly PropertyKey[];
}
