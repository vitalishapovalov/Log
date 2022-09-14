import { CrossPlatformUtilities, DecorateColorMethod, RGB } from "../../types";

export abstract class CrossPlatformUtilitiesBase implements CrossPlatformUtilities {

    abstract now(): number;
    abstract stringDecorateFn(val: any, args: RGB, decorateMethod: DecorateColorMethod): string;
    abstract isBrowser(): boolean;
    abstract isNode(): boolean;
    abstract isFirefox(): boolean;
    abstract isSafari(): boolean;

    public getTimeToExecMs(start: number): number {
        return parseFloat((this.now() - start).toFixed(3));
    }

}
