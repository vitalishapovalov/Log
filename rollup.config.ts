import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default {
    input: "src/index.ts",
    output: [
        { file: "dist/index.umd.js", format: "umd", sourcemap: true },
        { file: "dist/index.esm.js", format: "es", sourcemap: true },
    ],
    watch: {
        include: 'src/**',
    },
    plugins: [
        typescript({
            useTsconfigDeclarationDir: true,
            abortOnError: true,
            tsconfigOverride: {
                compilerOptions: {
                    declaration: true,
                }
            }
        }),
        commonjs(),
        resolve(),
        terser(),
        sourceMaps()
    ],
    onwarn(warning, next) {
        const isKnownIssue =
            /node_modules\/template-colors-web\/dist-npm\/StyledString\.js ->/.test(warning.message)
            || /eval\("require"\)/.test(warning.frame);
        if (!isKnownIssue) next(warning);
    },
};
