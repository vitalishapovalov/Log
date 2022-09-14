import { DecorateColorMethod, RGB } from "./Colors";

export interface CrossPlatformUtilities {
    isBrowser(): boolean;
    isNode(): boolean;
    isFirefox(): boolean;
    isSafari(): boolean;
    now(): number;
    getTimeToExecMs(start: number): number;
    stringDecorateFn(val: any, args: RGB, decorateMethod: DecorateColorMethod): string;
}
