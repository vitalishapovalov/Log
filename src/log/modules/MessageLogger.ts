import { isCallable, isString } from "@js-utilities/typecheck";

import { InstanceMessageLogger, LoggerOptions, Message } from "../types";
import { isBrowser, isFirefox, isNode, isSafari } from "../utils";
import { StringDecorator } from "./StringDecorator";
import { Configuration } from "./Configuration";

export namespace MessageLogger {

    export function logMessage<T extends any[]>(
        options: LoggerOptions,
        timeToExecMs: number,
        message: Message
    ): void {
        const SD = options[Configuration.constants.STRING_DECORATOR];
        const msgWithOptional = applyOptionalMessages(message, options, timeToExecMs, SD);

        // do not align on safari due to incorrect alignment
        // maybe fix in future, lowest priority
        let msg = isSafari()
            ? msgWithOptional.join("\n")
            : alignMessage(msgWithOptional, SD).join("\n");

        // newlines as message separators in node console
        if (isNode()) msg = "\n" + msg;

        msg = applyOptionalStyles(msg, SD);

        // interceptor call, if available
        if (isCallable(options.logInterceptor)) {
            const interceptResult = options.logInterceptor({
                ...message.logData,
                message: extractValueFromDecoratedString(msg),
                decoratedMessage: msg,
            });
            // means that log to console should be prevented
            if (false === interceptResult) return;
        }

        console[options.consoleMethod](msg);

        if (options.logExtensibleObjects && message.extensibleObjects) {
            console.log(...message.extensibleObjects.reduce(
                (acc, eo) => [...acc, eo.name, " : ", eo.value, "\n"],
                [])
            );
        }
    }

    export function createInstanceMessageLogger(options: LoggerOptions): InstanceMessageLogger {
        const log = method => (text: string, ...args: any[]) => {
            const SD = options[Configuration.constants.STRING_DECORATOR];
            let message = applyOptionalMessages(SD.otherText(text), options, null, SD, method);
            message = processInstanceMessageLoggerFormatters(message, SD);
            message = SD.decorateTextSpecialSymbols(message);
            message = isNode() ? message + " " : "  " + message + "  ";

            console.log(applyOptionalStyles(message, SD), ...args);
        };
        return {
            log: log("log"),
            warn: log("warn"),
            info: log("info"),
            error: log("error"),
        };
    }

    function applyOptionalMessages<T = string | Message>(
        message: T,
        options: LoggerOptions,
        timeToExecMs: string | number,
        SD: StringDecorator,
        method?: keyof InstanceMessageLogger
    ): T {
        // means that logger is LoggerProxy
        if (Array.isArray(message)) {
            if (options.name && options.logName) {
                const fieldLabel = options[Configuration.constants.IS_SUBCLASS]
                    ? "Logger, subclass of"
                    : "Logger";
                message.unshift(SD.getAssembledField(fieldLabel, SD.loggerName(options.name)));
            }
            if (options.logTimeStamp) {
                message.push(SD.getAssembledField("Timestamp", SD.timeStamp(new Date())));
            }
            if (options.logExecutionTime) {
                message.push(SD.getAssembledField("Execution time", SD.executionTime(timeToExecMs)));
            }
            return message;
        }

        // means that logger is InstanceMessageLogger
        const string = [];
        if (options.loggerOptions.logTimeStamp) {
            const logMs = Boolean(options.loggerOptions.logMs);
            string.push(String(SD.timeStamp(new Date(), false, logMs)));
        }
        if (options.name && options.loggerOptions.logName) {
            string.push(SD.loggerName(options.name));
        }
        if (options.loggerOptions.logSuffix) {
            const suffix = isString(options.loggerOptions.logSuffix)
                ? SD.otherText(options.loggerOptions.logSuffix)
                // log shouldn't have suffix, only if one defined
                : method !== "log"
                    ? StringDecorator.instanceLoggerMethod(method, SD)
                    : "";
            string.push(suffix);
        }
        const returnValue = string.length ? `[${string.join(" ")}]: ${message}` : `${message}`;
        return returnValue as unknown as T;
    }

    function applyOptionalStyles(text: string, SD: StringDecorator): string {
        /// background color
        let styledText: any = StringDecorator.decorate(
            text,
            SD.theme.background,
            isNode() ? "bgRgb" : "rgbBG"
        );

        /// line-height
        // safari and firefox both have blanks between lines when setting line-height,
        // so we should avoid adding them
        // node.js doesn't support it at all
        if (isBrowser() && !isFirefox() && !isSafari()) {
            styledText = styledText.style(`line-height: ${Configuration.constants.DEFAULT_LINE_HEIGHT};`);
        }

        return styledText;
    }

    function alignMessage(message: Message, SD: StringDecorator): Message {
        const messagesParts: string[][] = convertToMessageParts(message);
        const alignedLabels = alignMessageParts(messagesParts
            .map(([label]) => SD.decorateTextSpecialSymbols(label)));
        const alignedValues = alignMessageParts(messagesParts
            .map(([, value]) => SD.decorateTextSpecialSymbols(value)));
        const alignedParts = alignedLabels.map((_, i) => [
            `  ${alignedLabels[i]} `,
            ` ${alignedValues[i]}  `,
        ]);
        return convertToMessage(alignedParts, SD);
    }

    function alignMessageParts(misalignedParts: string[]): string[] {
        const extractedPartsValues = misalignedParts.map(extractValueFromDecoratedString);
        const longestValueLength = extractedPartsValues
            .reduce((max, val) => val.length > max ? val.length : max, 0);

        return misalignedParts.map((v, i) => {
            const lengthDiff = longestValueLength - extractedPartsValues[i].length + 1;
            return lengthDiff > 0 ? `${v}${Array(lengthDiff).join(" ")}` : v;
        });
    }

    function convertToMessageParts(message: Message): string[][] {
        return message.map(
            m => m.split(Configuration.constants.SEPARATOR)
        );
    }

    function convertToMessage(parts: string[][], SD: StringDecorator, applyStyling?: boolean): Message {
        return parts.map(m => m.join(
            applyStyling
                ? Configuration.constants.SEPARATOR
                : StringDecorator.decorate(Configuration.constants.SEPARATOR, SD.theme.fieldSeparator)
        ));
    }

    function processInstanceMessageLoggerFormatters(text: string, SD: StringDecorator): string {
        // replace template formatters with formatted values
        return text
            // $number()
            .replace(/\$number\([^)]*\)/g, s =>
                SD.number(s.replace(/(\$number\()|(\))/g, "")))
            // $string()
            .replace(/\$string\([^)]*\)/g, s =>
                SD.string(s.replace(/(\$string\()|(\))/g, "")));
    }

    function extractValueFromDecoratedString(string: string): string {
        // remove special symbols
        return String(string)
            // produced by "template-colors-web"
            .replace(/(<\s*span[^>]*>)|(<\s*\/\s*span>)/g, "")
            // produced by "chalk"
            .replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "");
    }
}
