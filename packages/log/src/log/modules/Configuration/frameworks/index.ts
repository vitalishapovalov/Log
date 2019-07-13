import { FrameworkInterface } from "../../../types";
import { SupportedFrameworks } from "./Framework";

import ReactJS from "./React";
import NestJS from "./Nest";

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
};

export const resolveFrameworkName = (target: object): SupportedFrameworks => {
    for (const framework of Object.keys(FRAMEWORKS)) {
        if (FRAMEWORKS[framework].isFrameworkComponent(target)) return framework as SupportedFrameworks;
    }
    return null;
};
