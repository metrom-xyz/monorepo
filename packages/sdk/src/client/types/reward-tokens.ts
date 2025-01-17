import type { BackendWhitelistedErc20Token } from "./commons";

export type BackendRewardToken = BackendWhitelistedErc20Token;

export interface BackendRewardTokensResponse {
    tokens: BackendRewardToken[];
}
