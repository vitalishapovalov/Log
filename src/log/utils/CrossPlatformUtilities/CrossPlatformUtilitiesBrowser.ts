import templateColorsWeb from "template-colors-web";

import { DecorateColorMethod, RGB } from "../../types";
import { CrossPlatformUtilitiesBase } from "./CrossPlatformUtilitiesBase";

export class CrossPlatformUtilitiesBrowser extends CrossPlatformUtilitiesBase {

    public now(): number {
        return performance.now();
    }

    public stringDecorateFn(val: any, args: RGB, decorateMethod: DecorateColorMethod): string {
        return templateColorsWeb`${val}`[decorateMethod](...args);
    }

    public isBrowser(): boolean {
        return true;
    }

    public isNode(): boolean {
        return false;
    }

    public isFirefox(): boolean {
        return this.isBrowser() && typeof InstallTrigger === "object";
    }

    public isSafari(): boolean {
        return this.isBrowser() && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }

}
