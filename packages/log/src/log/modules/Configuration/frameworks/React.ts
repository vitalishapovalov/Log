import { isFunction } from "@js-utilities/typecheck";

import Framework, { FrameworkConfigDynamicKey } from "./Framework";

export default new class extends Framework {

    [FrameworkConfigDynamicKey.TECHNICAL] = Object.freeze([
        "__reactInternalSnapshotBeforeUpdate",
        "_reactInternalFiber",
        "_reactInternalInstance",
        "__reactstandin__proxyGeneration",
        "__reactstandin__isMounted",
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

    isFrameworkComponent(context: object): boolean {
        return (isFunction(context) && String(context).includes("return React.createElement"))
            || Boolean((Reflect.getPrototypeOf(context) as any).isReactComponent);
    }

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
}
