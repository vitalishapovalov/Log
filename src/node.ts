import "./polyfills";

import { Configuration } from "./log/modules/Configuration";
import { CrossPlatformUtilitiesNode } from "./log/utils/CrossPlatformUtilities/CrossPlatformUtilitiesNode";

Configuration.setCrossPlatformUtilities(new CrossPlatformUtilitiesNode());

export { Log, log } from "./log";

export { InstanceMessageLogger } from "./log/types";
