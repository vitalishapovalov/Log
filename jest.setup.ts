import "@jest-decorated/core/globals";

import "./src/polyfills";

// keep snapshots synced with CI (chalk)
process.env.CI = "TRAVIS";
