// @ts-ignore
import commonConfig from "../../rollup.common.ts";

export default {
    ...commonConfig,
    onwarn(warning, next) {
        const isKnownIssue =
            /node_modules\/template-colors-web\/dist-npm\/StyledString\.js ->/.test(warning.message)
            || /requireFunc = isBrowser\(\) \? \(\) => void 0 : eval\("require"\)/.test(warning.frame);
        if (!isKnownIssue) next(warning);
    },
};
