import "./polyfills";

import { Configuration } from "./log/modules/Configuration";
import { CrossPlatformUtilitiesBrowser } from "./log/utils/CrossPlatformUtilities/CrossPlatformUtilitiesBrowser";

Configuration.setCrossPlatformUtilities(new CrossPlatformUtilitiesBrowser());

export { Log, log } from "./log";

export { InstanceMessageLogger } from "./log/types";
