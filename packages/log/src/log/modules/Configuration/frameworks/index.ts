import { FrameworkInterface, LoggerOptions } from "../../../types";
import { SupportedFrameworks } from "./Framework";

import ReactJS from "./React";
import NestJS from "./Nest";
import VueJS from "./Vue";
import Angular from "./Angular";

export {
    SupportedFrameworks,
    FrameworkConfigDynamicKey,
    FrameworkConfigStaticKey,
} from "./Framework";

export const FRAMEWORKS: { [F in SupportedFrameworks]: FrameworkInterface; } = {
    /**
     * React.js
     * https://reactjs.org/
     */
    [SupportedFrameworks.REACT]: ReactJS,

    /**
     * Nest.js
     * https://nestjs.com/
     */
    [SupportedFrameworks.NEST]: NestJS,

    /**
     * Vue.js
     * https://vuejs.org
     */
    [SupportedFrameworks.VUE]: VueJS,

    /**
     * Angular
     * https://angular.io/
     */
    [SupportedFrameworks.ANGULAR]: Angular,
};

export const resolveFrameworkName = (target: object, options: LoggerOptions): SupportedFrameworks => {
    for (const framework of Object.keys(FRAMEWORKS)) {
        if (
            Boolean(options[framework]) ||
            FRAMEWORKS[framework].isFrameworkComponent(target)
        ) {
            return framework as SupportedFrameworks;
        }
    }
    return null;
};
