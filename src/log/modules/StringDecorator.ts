import { isNumber } from "@js-utilities/typecheck";

import {
    DecorateColorMethod,
    Design,
    DesignType,
    InstanceMessageLogger,
    LoggerOptions,
    LoggerTheme,
    RGB,
} from "../types";
import { resolveDesignType } from "../utils/design";
import { toString } from "../utils/other";
import { Configuration } from "./Configuration";

export class StringDecorator {

    public static decorate(
        val: any,
        args: RGB,
        decorateMethod: DecorateColorMethod = "rgb"
    ): string {
        return Configuration.getCrossPlatformUtilities().stringDecorateFn(val, args, decorateMethod);
    }

    public static instanceLoggerMethod(method: keyof InstanceMessageLogger, SD: StringDecorator): string {
        return StringDecorator.decorate(method.toUpperCase(), SD.theme[method]);
    }

    private static getDoubleCharTime(time: number): string {
        return `${time}`.length < 2 ? `0${time}` : `${time}`;
    }

    private static createReplacer(
        regExp: RegExp,
        params: [number, number][],
        replaceWith: string
    ): (s: string, i: number, str: string) => string {
        return (s, i, str) => {
            const isStyleEq = params
                .map(([from, length]) => str.substr((i - from) >= 0 ? i - from : 0, length))
                .some(substring => regExp.test(substring));
            return isStyleEq ? s : replaceWith;
        };
    }

    public readonly theme: LoggerTheme;
    public readonly comma: string;
    public readonly dot: string;
    public readonly eq: string;
    public readonly colon: string;
    public readonly semicolon: string;
    public readonly arrow: string;
    public readonly inOp: string;
    public readonly newOp: string;
    public readonly deleteOp: string;
    public readonly functionOp: string;
    public readonly staticOp: string;
    public readonly hook: string;
    public readonly bound: string;

    public constructor(private readonly options: LoggerOptions) {
        this.theme = (() => {
            switch (this.options.theme) {
                case "dark": return Configuration.constants.DARK_THEME;
                case "light": return Configuration.constants.LIGHT_THEME;
                default: return {
                    ...Configuration.constants.DEFAULT_THEME,
                    ...(this.options.theme as object || {}),
                };
            }
        })();
        this.comma = StringDecorator.decorate(",", this.theme.comma);
        this.dot = StringDecorator.decorate(".", this.theme.dot);
        this.eq = StringDecorator.decorate("=", this.theme.eq);
        this.colon = StringDecorator.decorate(":", this.theme.colon);
        this.semicolon = StringDecorator.decorate(";", this.theme.semicolon);
        this.arrow = StringDecorator.decorate("->", this.theme.arrow);
        this.inOp = StringDecorator.decorate("in", this.theme.in);
        this.newOp = StringDecorator.decorate("new", this.theme.new);
        this.deleteOp = StringDecorator.decorate("delete", this.theme.delete);
        this.functionOp = StringDecorator.decorate("function", this.theme.function);
        this.staticOp = StringDecorator.decorate("static", this.theme.static);
        this.hook = StringDecorator.decorate("Hook", this.theme.hook);
        this.bound = StringDecorator.decorate("bound", this.theme.bound);
    }

    public bracket(val: "{" | "}" | "{}"): string {
        return StringDecorator.decorate(val, this.theme.brackets);
    }

    public squareBracket(val: "[" | "]" | "[]"): string {
        return StringDecorator.decorate(val, this.theme.squareBrackets);
    }

    public parentheses(val: "(" | ")" | "()"): string {
        return StringDecorator.decorate(val, this.theme.parentheses);
    }

    public accessor(type: "get" | "set"): string {
        return StringDecorator.decorate(type, this.theme.accessor);
    }

    public succeed(str: "succeed" | "success"): string {
        return StringDecorator.decorate(str, this.theme.succeed);
    }

    public failed(str: "failed" | "fail"): string {
        return StringDecorator.decorate(str, this.theme.failed);
    }

    public propertyName(prop: string): string {
        return StringDecorator.decorate(prop, this.theme.propertyName);
    }

    public methodName(method: string): string {
        return StringDecorator.decorate(method, this.theme.methodName);
    }

    public type(type: string | DesignType): string {
        return StringDecorator.decorate(type, this.theme.type);
    }

    public fieldLabel(label: string): string {
        return StringDecorator.decorate(label, this.theme.fieldLabel);
    }

    public otherText(text: string | number | Function): string {
        return StringDecorator.decorate(text, this.theme.otherText);
    }

    public number(num: string | number): string {
        return StringDecorator.decorate(num, this.theme.number);
    }

    public string(text: string): string {
        return StringDecorator.decorate(`"${text}"`, this.theme.string);
    }

    public boolean(value: string): string {
        return StringDecorator.decorate(value, this.theme.boolean);
    }

    public objectLike(object: any, removeBrackets: boolean = false): string {
        let objString = toString(object);
        if (objString && objString.length) {
            objString = objString.replace("object ", "");
        }
        if (removeBrackets) {
            objString = objString.replace(/(\[)|(])/g, "");
        }
        return StringDecorator.decorate(objString, this.theme.objectLike);
    }

    public func(f: Function, logDepth: number): string {
        const argsArr = logDepth
            ? `(${Array(f.length)
                    .fill("a")
                    .map((v, i) => this.otherText(v + (i + 1)))
                    .join(", ")})`
            : "";
        const name = logDepth ? this.methodName(f.name) : "";
        return `function ${name}${argsArr} {}`;
    }

    public unknownType(val: any, removeBrackets?: boolean, logDepth?: number): string {
        if (val === Configuration.constants.PROMISE_FAILED) {
            return this.failed("failed");
        }
        switch (resolveDesignType(val)) {
            case DesignType.BOOLEAN:
                return this.boolean(val);
            case DesignType.NUMBER:
                return this.number(val);
            case DesignType.STRING:
                return this.string(val);
            case DesignType.OBJECT:
                return isNumber(logDepth)
                    ? this.logObjectProperties(val, logDepth)
                    : this.objectLike(val, removeBrackets);
            case DesignType.ARRAY:
                return isNumber(logDepth)
                    ? this.logArrayProperties(val, logDepth)
                    : this.objectLike(val, removeBrackets);
            case DesignType.UNDEFINED:
                return StringDecorator.decorate("undefined", this.theme.undefined);
            case DesignType.NULL:
                return StringDecorator.decorate("null", this.theme.null);
            case DesignType.FUNCTION:
                return this.func(val, logDepth);
            case DesignType.UNKNOWN:
            case DesignType.SYMBOL:
            default:
                return this.otherText(val);
        }
    }

    public loggerName(name: number | string): string {
        return StringDecorator.decorate(name, this.theme.loggerName);
    }

    public executionTime(time: number | string): string {
        const splitTime = String(time).split(".");
        const decoratedTime = splitTime.length > 1
            ? splitTime.map(t => StringDecorator.decorate(t, this.theme.executionTime)).join(".")
            : StringDecorator.decorate(splitTime[0], this.theme.executionTime);
        return decoratedTime + StringDecorator.decorate("ms", this.theme.executionTimeMs);
    }

    public timeStamp(date: Date, addBrackets: boolean = true, logMS: boolean = true): string {
        const ts = (t: string) => StringDecorator.decorate(t, this.theme.timeStamp);
        const hrs = ts(StringDecorator.getDoubleCharTime(date.getHours()));
        const min = ts(StringDecorator.getDoubleCharTime(date.getMinutes()));
        const sec = ts(StringDecorator.getDoubleCharTime(date.getSeconds()));
        const ms = logMS ? `.${ts(String(date.getMilliseconds()))}` : "";
        const dateString = `${addBrackets ? "[" : ""}${hrs}:${min}:${sec}${ms}${addBrackets ? "]" : ""}`;
        return StringDecorator.decorate(dateString, this.theme.timeStamp);
    }

    public logObjectProperties(obj: object, maxLength: number = 2): string {
        if (!obj) return this.unknownType(obj);
        const keys = Object.keys(obj);
        if (!keys.length) return "{}";
        const props = keys.reduce((acc, propKey, i) => {
            if ((i + 1) > maxLength) return acc;
            const prefix = !acc ? "" : ", ";
            const prop = `${this.propertyName(propKey)}: ${this.unknownType(obj[propKey], true)}`;
            return acc + prefix + prop;
        }, ""); // tslint:disable-line:align
        const dots = keys.length > maxLength ? this.otherText(", ...") : "";
        return "{ " + props + dots + " }";
    }

    public logArrayProperties(arr: any[], maxLength: number = 4): string {
        if (!arr) return this.unknownType(arr);
        const props = arr.reduce((acc, prop, i) => {
            if ((i + 1) > maxLength) return acc;
            const prefix = !acc ? "" : ", ";
            return acc + prefix + this.unknownType(prop, true);
        }, ""); // tslint:disable-line:align
        const dots = arr.length > maxLength ? this.otherText(", ...") : "";
        return "[" + props + dots + "]";
    }

    public paramsString(design: Design, max = Number.MAX_SAFE_INTEGER): string {
        return `(${design.paramTypes
            .reduce((acc, t, i) => i >= max
                ? (acc.includes("...") ? acc : `${acc}, ${this.otherText("...")}`)
                // tslint:disable-next-line:align
                : `${acc ? `${acc}, ` : ""}${this.otherText(`arg${i + 1}`)}: ${this.type(t)}`, "")}): ${this.type(design.returnType)};`;
    }

    public calledWithString(args: any[], logDepth: (number | null | undefined)[]): string {
        if (!args) return "()";
        return `(${args.reduce((acc, t, i) => `${acc ? `${acc}, ` : ""}${this.unknownType(args[i], true, logDepth[i])}`, "")})`;
    }

    public accessorString(accessor: "get" | "set", prop: string, designType: DesignType): string {
        return `${accessor} ${prop}(): ${this.type(designType)};`;
    }

    public getLoggerNameString(target: any): string {
        const opts = target[Configuration.constants.OPTIONS];
        return `${this.otherText(opts.name)}${opts[Configuration.constants.IS_SUBCLASS]
            ? this.otherText(" subclass")
            : ""}`;
    }

    public getAssembledField(field: string, value: string | number | symbol): string {
        return this.fieldLabel(field) + " " + Configuration.constants.SEPARATOR + " " + String(value);
    }

    public decorateTextSpecialSymbols(text: string): string {
        // parse text and replace some of matched symbols/substrings with
        // their decorated analogs
        // in node.js, ansi colors in console are producing special symbols (e.g. "[", ";", "\u001b")
        // and in browser, we're using "template-colors-web" package which producing
        // <span style="color: rgb(0,0,0)"> etc.
        // it's hard to distinct should-be-replaced symbols and special symbols (e.g. ",", ";", "[")
        // so somewhere we're using additional regexp to avoid replacing special symbols
        return text
            // special case: we're assuming that if ";" symbol is last in a row -
            // it's not an ansi/tcw color and should be replaced
            .replace(
                /;/g,
                (v, i, str) => i === str.length - 1 ? this.semicolon : v
            )
            .replace(/\[/g, StringDecorator
                .createReplacer(/\u001b\[.*/, [[1, 2]], this.squareBracket("[")))
            .replace(/\(/g, StringDecorator
                .createReplacer(/<span style="color: rgb/, [[23, 23]], this.parentheses("(")))
            .replace(/\)/g, StringDecorator
                .createReplacer(/^.*\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/, [[14, 15]], this.parentheses(")")))
            .replace(/,/g, StringDecorator
                .createReplacer(/^.*<span style=".*$/, [[27, 13], [32, 20]], this.comma))
            .replace(/=/g, StringDecorator
                .createReplacer(/<span style/, [[11, 11]], this.eq))
            .replace(/:/g, StringDecorator
                .createReplacer(/<span style="color/, [[18, 18]], this.colon))
            .replace(/\./g, this.dot)
            .replace(/->/g, this.arrow)
            .replace(/ in /g, ` ${this.inOp} `)
            .replace(/ new /g, ` ${this.newOp} `)
            .replace(/ delete /g, ` ${this.deleteOp} `)
            .replace(/( function )|( function)|(function )/g, s =>
                s.replace("function", this.functionOp))
            .replace(/ bound /, this.bound)
            .replace(/ static /g, ` ${this.staticOp} `)
            .replace(/ Hook /g, ` ${this.hook} `)
            .replace(/{/g, this.bracket("{"))
            .replace(/}/g, this.bracket("}"))
            .replace(/{}/g, this.bracket("{}"))
            .replace(/]/g, this.squareBracket("]"))
            .replace(/\[]/g, this.squareBracket("[]"))
            .replace(/\(\)/g, this.parentheses("()"))
            .replace(/ get /g, ` ${this.accessor("get")} `)
            .replace(/ set /g, ` ${this.accessor("set")} `)
            .replace(/( succeed )|( succeed)/g, s =>
                s.replace("succeed", this.succeed("succeed")))
            .replace(/( success )|( success)/g, s =>
                s.replace("success", this.succeed("success")))
            .replace(/( failed )|( failed)/g, s =>
                s.replace("failed", this.failed("failed")))
            .replace(/( fail )|( fail)/g, s =>
                s.replace("fail", this.failed("fail")));
    }
}
