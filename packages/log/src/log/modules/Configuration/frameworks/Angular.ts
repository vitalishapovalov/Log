import Framework, { FrameworkConfigDynamicKey } from "./Framework";

export default new class extends Framework {

    [FrameworkConfigDynamicKey.TECHNICAL] = Object.freeze([
        "",
    ]);

    [FrameworkConfigDynamicKey.HOOKS] = Object.freeze([
        "ngOnChanges",
        "ngOnInit",
        "ngDoCheck",
        "ngAfterContentInit",
        "ngAfterContentChecked",
        "ngAfterViewInit",
        "ngAfterViewChecked",
        "ngOnDestroy",
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
        "",
    ]);

    [FrameworkConfigDynamicKey.OTHER] = Object.freeze([
        "createComment",
        "createElement",
        "createElementNS",
        "createTextNode",
        "querySelector",
        "transform",
    ]);

    isFrameworkComponent(context: object): boolean {
        if (!context || !(context as any).prototype || !(context as any).prototype.constructor) {
            return false;
        }
        const c = (context as any).prototype.constructor;
        return "__annotations__" in c || "__parameters__" in c || "__prop__metadata__" in c;
    }

    isLogDesirable(str: PropertyKey): boolean {
        return [
            "transform",
        ].includes(str as string);
    }

    shouldLogReturnValue(str: PropertyKey): boolean {
        return [
            "createComment",
            "createElement",
            "createElementNS",
            "createTextNode",
            "querySelector",
            "transform",
        ].includes(str as string);
    }
}
