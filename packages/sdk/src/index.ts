import { CoreClient as InternalCoreClient } from "./client/core";

export const CoreClient = new InternalCoreClient();

export { SupportedChain } from "@metrom-xyz/contracts";
export { MetromApiClient } from "./client/metrom";
export { AmmSubgraphClient } from "./client/subgraph/amm";
export { MetromSubgraphClient } from "./client/subgraph/metrom";
export * from "./utils/formatting";
export * from "./entities";
