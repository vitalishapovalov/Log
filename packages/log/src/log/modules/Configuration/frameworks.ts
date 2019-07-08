import { isFunction } from "@js-utilities/typecheck";

import { FrameworkInterface } from "../../types";

/**
 * TODO
 *  abstract 'includes', 'isHook'
 *  isNestComponent
 */

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
    NEST = "nest"
}

export const resolveFrameworkName = (target: object): SupportedFrameworks => {
    if (isReactComponent(target)) return SupportedFrameworks.REACT;
    return null;
};

export const FRAMEWORKS: { [F in SupportedFrameworks]: FrameworkInterface; } = {
    /**
     * React.js
     * https://reactjs.org/
     */
    [SupportedFrameworks.REACT]: Object.freeze({
        [FrameworkConfigDynamicKey.TECHNICAL]: Object.freeze([
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
        ]),
        [FrameworkConfigDynamicKey.HOOKS]: Object.freeze([
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
        ]),
        [FrameworkConfigDynamicKey.STATE]: Object.freeze([
            "state",
        ]),
        [FrameworkConfigDynamicKey.PROPS]: Object.freeze([
            "props",
        ]),
        [FrameworkConfigDynamicKey.REFS]: Object.freeze([
            "refs",
        ]),
        [FrameworkConfigDynamicKey.CONTEXT]: Object.freeze([
            "context",
        ]),
        [FrameworkConfigDynamicKey.OTHER]: Object.freeze([
            "forceUpdate",
            "setState",
            "contextType",
            "contextTypes",
            "propTypes",
            "defaultProps",
        ]),
        includes(str: PropertyKey): boolean {
            const props = [];
            for (const k in FrameworkConfigDynamicKey) props.push(...this[FrameworkConfigDynamicKey[k]]);
            return props.includes(str);
        },
        isHook(str: PropertyKey): boolean {
            return this[FrameworkConfigDynamicKey.HOOKS].includes(str);
        },
        isLogDesirable(str: PropertyKey): boolean {
            return [
                "forceUpdate",
                "setState",
            ].includes(str as string);
        },
        shouldLogReturnValue(str: PropertyKey): boolean {
            return [
                "render",
                "shouldComponentUpdate",
                "getSnapshotBeforeUpdate",
                "getDerivedStateFromProps",
                "getDerivedStateFromError",
            ].includes(str as string);
        },
    }),
    /**
     * Nest.js
     * https://nestjs.com/
     */
    [SupportedFrameworks.NEST]: Object.freeze({
        [FrameworkConfigDynamicKey.TECHNICAL]: Object.freeze([
            "then",
        ]),
        [FrameworkConfigDynamicKey.HOOKS]: Object.freeze([
            "onModuleInit",
            "onModuleDestroy",
            "onApplicationBootstrap",
            "onApplicationShutdown",
            "configure",
            "getGlobalInterceptors",
            "getGlobalGuards",
        ]),
        [FrameworkConfigDynamicKey.STATE]: Object.freeze([
            "",
        ]),
        [FrameworkConfigDynamicKey.PROPS]: Object.freeze([
            "",
        ]),
        [FrameworkConfigDynamicKey.REFS]: Object.freeze([
            "",
        ]),
        [FrameworkConfigDynamicKey.CONTEXT]: Object.freeze([
            "context",
        ]),
        [FrameworkConfigDynamicKey.OTHER]: Object.freeze([
            "use",
            "intercept",
            "catch",
            "transform",
            "canActivate",
        ]),
        includes(str: PropertyKey): boolean {
            const props = [];
            for (const k in FrameworkConfigDynamicKey) props.push(...this[FrameworkConfigDynamicKey[k]]);
            return props.includes(str);
        },
        isHook(str: PropertyKey): boolean {
            return this[FrameworkConfigDynamicKey.HOOKS].includes(str);
        },
        isLogDesirable(str: PropertyKey): boolean {
            return [
                "use",
                "intercept",
                "catch",
                "transform",
                "canActivate",
            ].includes(str as string);
        },
        shouldLogReturnValue(str: PropertyKey): boolean {
            return [
                "configure",
                "getGlobalInterceptors",
                "getGlobalGuards",
                "transform",
                "canActivate"
            ].includes(str as string);
        },
    })
};

// tslint:disable-next-line:variable-name
const isReactComponent = (_this: object): boolean => (
    (isFunction(_this) && String(_this).includes("return React.createElement"))
    || Boolean((Reflect.getPrototypeOf(_this) as any).isReactComponent)
);
