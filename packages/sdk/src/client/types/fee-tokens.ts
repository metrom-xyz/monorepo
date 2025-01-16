import type { BackendWhitelistedErc20Token } from "./commons";

export type BackendFeeToken = BackendWhitelistedErc20Token;

export interface BackendFeeTokensResponse {
    tokens: BackendFeeToken[];
}
