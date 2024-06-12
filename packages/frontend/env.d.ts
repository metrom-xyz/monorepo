/// <reference types="vite/client" />

import type { Environment } from "@metrom-xyz/contracts";

declare global {
    const __ENVIRONMENT__: Environment;
}
