import Framework, { FrameworkConfigDynamicKey } from "./Framework";

export default new class extends Framework {

    [FrameworkConfigDynamicKey.TECHNICAL] = Object.freeze([
        "__file",
        "_Ctor",
        "_compiled",
        "_scopeId",
        "_base",
        "__VUE_DEVTOOLS_UID__",
        "_isBeingDestroyed",
        "_hasHookEvent",
        "_isMounted",
        "_uid",
        "__patch__",
        "_routerRoot",
        "_renderProxy",
        "_render",
        "_watcher",
        "_watchers",
        "fnContext",
        "_update",
        "_vnode",
        "_events",
        "_data",
        "_isDestroyed",
        "_isVue",
    ]);

    [FrameworkConfigDynamicKey.HOOKS] = Object.freeze([
        "created",
        "beforeMount",
        "mounted",
        "beforeUpdate",
        "updated",
        "activated",
        "deactivated",
        "destroyed",
        "errorCaptured",
        "render",
    ]);

    [FrameworkConfigDynamicKey.STATE] = Object.freeze([
        "data",
        "$data",
    ]);

    [FrameworkConfigDynamicKey.PROPS] = Object.freeze([
        "props",
        "propsData",
        "$props",
    ]);

    [FrameworkConfigDynamicKey.REFS] = Object.freeze([
        "$refs",
    ]);

    [FrameworkConfigDynamicKey.CONTEXT] = Object.freeze([
        "",
    ]);

    [FrameworkConfigDynamicKey.OTHER] = Object.freeze([
        "$options",
        "$isServer",
        "staticRenderFns",
        "name",
        "functional",
        "inject",
        "mixins",
        "directives",
        "extends",
        "components",
        "directives",
        "filters",
        "el",
        "$el",
        "template",
        "renderError",
        "provide",
        "delimiters",
        "model",
        "inheritAttrs",
        "comments",
        "parent",
        "$parent",
        "$root",
        "computed",
        "methods",
        "watch",
        "$children",
        "$slots",
        "$scopedSlots",
        "$attrs",
        "$listeners",
        "$watch",
        "$set",
        "$delete",
        "$on",
        "$once",
        "$off",
        "$emit",
        "$mount",
        "$forceUpdate",
        "$nextTick",
        "$destroy",
        "beforeDestroy",
        "beforeCreate",
        "$vnode",
        "$children",
        "$scopedSlots",
        "superOptions",
        "extendOptions",
        "sealedOptions",
        "$store",
    ]);

    isFrameworkComponent(context: object): boolean {
        if (!context) return false;
        if ("$data" in context && "_init" in context && "$ssrContext" in context) return true;
        if (!(context as any).prototype) return false;
        const proto: any = Reflect.getPrototypeOf((context as any).prototype);
        if (!proto) return false;
        return proto.__patch__ && proto.$nextTick && proto._init;
    }

    isLogDesirable(str: PropertyKey): boolean {
        return [
            "$set",
            "$delete",
            "$data",
            "$props",
            "$forceUpdate",
            "$destroy",
        ].includes(str as string);
    }

    shouldLogReturnValue(str: PropertyKey): boolean {
        return [
            "render",
            "errorCaptured",
        ].includes(str as string);
    }
}
