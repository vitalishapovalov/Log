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
}

export const resolveFrameworkName = (target: object): SupportedFrameworks => {
    if (isReactComponent(target)) return SupportedFrameworks.REACT;
    return null;
};

export const FRAMEWORKS: { [F in SupportedFrameworks]: FrameworkInterface; } = {
    /**
     * React.js
     */
    [SupportedFrameworks.REACT]: Object.freeze({
        [FrameworkConfigDynamicKey.TECHNICAL]: Object.freeze([
            "updater",
            "_reactInternalFiber",
            "_reactInternalInstance",
            "getInitialState",
            "getDefaultProps",
            "UNSAFE_componentWillUpdate",
            "UNSAFE_componentWillReceiveProps",
            "UNSAFE_componentWillMount",
            "UNSAFE_componentWillRecieveProps",
            "componentWillUpdate",
            "componentDidUnmount",
            "componentShouldUpdate",
            "componentDidReceiveProps",
            "getChildContext",
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
};

// tslint:disable-next-line:variable-name
const isReactComponent = (_this: object): boolean => (
    (isFunction(_this) && String(_this).includes("return React.createElement"))
    || Boolean((Reflect.getPrototypeOf(_this) as any).isReactComponent)
);
