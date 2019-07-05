export const toString = (value: any): string => ({}).toString.call(value);

export const fnToString = (value: any): string => {
    try {
        return Function.prototype.toString.call(value);
    } catch {
        return "";
    }
};
