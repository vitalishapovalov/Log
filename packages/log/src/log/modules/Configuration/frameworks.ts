import { isFunction } from "@js-utilities/typecheck";

import { FrameworkInterface } from "../../types";

export enum FrameworkConfigDynamicKey {
    TECHNICAL = "logTechnical",
    STATE = "logState",
    PROPS = "logProps",
    HOOKS = "logHooks",
    REFS = "logRefs",
    CONTEXT = "logContext",
    OTHER = "logOther",
}

export enum FrameworkConfigStaticKey {
    ARGS_LOG_DEPTH = "argsLogDepth",
}

export enum SupportedFrameworks {
    REACT = "react",
    NEST = "nest",
}

abstract class Framework implements FrameworkInterface {

    includes(str: PropertyKey): boolean {
        const props = [];
        for (const k in FrameworkConfigDynamicKey) props.push(...this[FrameworkConfigDynamicKey[k]]);
        return props.includes(str);
    }

    isHook(str: PropertyKey): boolean {
        return this[FrameworkConfigDynamicKey.HOOKS].includes(str);
    }

    abstract isLogDesirable(str: PropertyKey): boolean;
    abstract shouldLogReturnValue(str: PropertyKey): boolean;

    abstract [FrameworkConfigDynamicKey.TECHNICAL];
    abstract [FrameworkConfigDynamicKey.HOOKS];
    abstract [FrameworkConfigDynamicKey.STATE];
    abstract [FrameworkConfigDynamicKey.PROPS];
    abstract [FrameworkConfigDynamicKey.REFS];
    abstract [FrameworkConfigDynamicKey.CONTEXT];
    abstract [FrameworkConfigDynamicKey.OTHER];
}

export const FRAMEWORKS: { [F in SupportedFrameworks]: FrameworkInterface; } = {
    /**
     * React.js
     * https://reactjs.org/
     */
    [SupportedFrameworks.REACT]: new class extends Framework {

        [FrameworkConfigDynamicKey.TECHNICAL] = Object.freeze([
            "__reactInternalSnapshotBeforeUpdate",
            "_reactInternalFiber",
            "_reactInternalInstance",
            "updater",
            "getInitialState",
            "getDefaultProps",
            "UNSAFE_componentWillUpdate",
            "UNSAFE_componentWillReceiveProps",
            "UNSAFE_componentWillMount",
            "UNSAFE_componentWillRecieveProps",
            "unstable_handleError",
            "componentWillUpdate",
            "componentDidUnmount",
            "componentShouldUpdate",
            "componentDidReceiveProps",
            "getChildContext",
            "reactstandinproxyGeneration",
            "REACT_HOT_LOADER_RENDERED_GENERATION",
            "$$typeof",
        ]);

        [FrameworkConfigDynamicKey.HOOKS] = Object.freeze([
            "render",
            "componentDidMount",
            "shouldComponentUpdate",
            "getSnapshotBeforeUpdate",
            "componentDidUpdate",
            "componentWillUnmount",
            "componentDidCatch",
            "componentWillMount",
            "componentWillReceiveProps",
            "componentWillRecieveProps",
            "getDerivedStateFromProps",
            "getDerivedStateFromError",
        ]);

        [FrameworkConfigDynamicKey.STATE] = Object.freeze([
            "state",
        ]);

        [FrameworkConfigDynamicKey.PROPS] = Object.freeze([
            "props",
        ]);

        [FrameworkConfigDynamicKey.REFS] = Object.freeze([
            "refs",
        ]);

        [FrameworkConfigDynamicKey.CONTEXT] = Object.freeze([
            "context",
        ]);

        [FrameworkConfigDynamicKey.OTHER] = Object.freeze([
            "forceUpdate",
            "setState",
            "contextType",
            "contextTypes",
            "propTypes",
            "defaultProps",
        ]);

        isLogDesirable(str: PropertyKey): boolean {
            return [
                "forceUpdate",
                "setState",
            ].includes(str as string);
        }

        shouldLogReturnValue(str: PropertyKey): boolean {
            return [
                "render",
                "shouldComponentUpdate",
                "getSnapshotBeforeUpdate",
                "getDerivedStateFromProps",
                "getDerivedStateFromError",
            ].includes(str as string);
        }
    },

    /**
     * Nest.js
     * https://nestjs.com/
     */
    [SupportedFrameworks.NEST]: new class extends Framework {

        [FrameworkConfigDynamicKey.TECHNICAL] = Object.freeze([
            "then",
        ]);

        [FrameworkConfigDynamicKey.HOOKS] = Object.freeze([
            "onModuleInit",
            "onModuleDestroy",
            "onApplicationBootstrap",
            "onApplicationShutdown",
            "configure",
            "getGlobalInterceptors",
            "getGlobalGuards",
        ]);

        [FrameworkConfigDynamicKey.STATE] = Object.freeze([
            "",
        ]);

        [FrameworkConfigDynamicKey.PROPS] = Object.freeze([
            "",
        ]);

        [FrameworkConfigDynamicKey.REFS] = Object.freeze([
            "",
        ]);

        [FrameworkConfigDynamicKey.CONTEXT] = Object.freeze([
            "context",
        ]);

        [FrameworkConfigDynamicKey.OTHER] = Object.freeze([
            "use",
            "intercept",
            "catch",
            "transform",
            "canActivate",
        ]);

        isLogDesirable(str: PropertyKey): boolean {
            return [
                "use",
                "intercept",
                "catch",
                "transform",
                "canActivate",
            ].includes(str as string);
        }

        shouldLogReturnValue(str: PropertyKey): boolean {
            return [
                "configure",
                "getGlobalInterceptors",
                "getGlobalGuards",
                "transform",
                "canActivate"
            ].includes(str as string);
        }
    }
};

// tslint:disable:variable-name

export const resolveFrameworkName = (target: object): SupportedFrameworks => {
    if (isReactComponent(target)) return SupportedFrameworks.REACT;
    if (isNestComponent(target)) return SupportedFrameworks.NEST;
    return null;
};

const isReactComponent = (_this: object): boolean => (
    (isFunction(_this) && String(_this).includes("return React.createElement"))
    || Boolean((Reflect.getPrototypeOf(_this) as any).isReactComponent)
);

const isNestComponent = (_this: object): boolean => {
    const hasOptionsMetadata = Reflect.hasMetadata("scope:options", _this);
    console.log("hasOwnMetadata", Reflect.hasOwnMetadata("scope:options", _this));
    console.log("hasMetadata", Reflect.hasMetadata("scope:options", _this));
    console.log(Reflect.getMetadataKeys(_this));
    return hasOptionsMetadata;
};
