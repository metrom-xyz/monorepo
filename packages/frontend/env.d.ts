/// <reference types="vite/client" />

import type { Environment } from "sdk";

declare global {
    const __ENVIRONMENT__: Environment;
}
