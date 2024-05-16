import { CoreClient as InternalCoreClient } from "./client/core";

export const CoreClient = new InternalCoreClient();

export { SupportedChain } from "@metrom-xyz/contracts";
export { MetromApiClient } from "./client/backend/metrom";
export { AmmSubgraphClient } from "./client/subgraph/amm";
export * from "./utils/formatting";
export * from "./entities";
export * from "./commons";
