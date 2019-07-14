import Framework, { FrameworkConfigDynamicKey } from "./Framework";

export default new class extends Framework {

    [FrameworkConfigDynamicKey.TECHNICAL] = Object.freeze([
        "then",
    ]);

    [FrameworkConfigDynamicKey.HOOKS] = Object.freeze([
        "onModuleInit",
        "onModuleDestroy",
        "onApplicationBootstrap",
        "onApplicationShutdown",
        "configure",
        "catch",
        "intercept",
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
        "transform",
        "canActivate",
    ]);

    isFrameworkComponent(context: object): boolean {
        const expectedNestMetadata = [
            "scope:options",
            "imports",
            "controllers",
            "providers",
            "export",
            "self:properties_metadata",
            "__exceptionFilters__",
            "__filterCatchExceptions__",
            "__pipes__",
            "__guards__",
        ];
        for (const option of expectedNestMetadata) {
            if (Reflect.hasMetadata(option, context)) return true;
        }
        return false;
    }

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
            "canActivate",
        ].includes(str as string);
    }
};
