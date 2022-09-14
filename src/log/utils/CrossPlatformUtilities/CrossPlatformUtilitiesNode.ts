const chalk = require("chalk");
const perf_hooks = require("perf_hooks");

import { DecorateColorMethod, RGB } from "../../types";
import { CrossPlatformUtilitiesBase } from "./CrossPlatformUtilitiesBase";

export class CrossPlatformUtilitiesNode extends CrossPlatformUtilitiesBase {

    public now(): number {
        return perf_hooks.performance.now()
    }

    public stringDecorateFn(val: any, args: RGB, decorateMethod: DecorateColorMethod): string {
        return chalk[decorateMethod](...args)(val);
    }

    public isBrowser(): boolean {
        return false;
    }

    public isNode(): boolean {
        return true;
    }

    public isFirefox(): boolean {
        return false;
    }

    public isSafari(): boolean {
        return false;
    }

}