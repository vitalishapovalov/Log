declare const InstallTrigger: object;

declare module "template-colors-web" {

    export default function (strings: TemplateStringsArray, ...args: any[]): TemplateColorsWebString;

    interface TemplateColorsWebString {
        rgb(R: number, G: number, B: number): this;
        rgbBG(R: number, G: number, B: number): this;
        style(styleString: string): this;
    }
}
