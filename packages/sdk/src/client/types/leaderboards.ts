import type { Address } from "viem";
import type { BackendUsdPricedErc20Token } from "./commons";

export interface BackendLeaderboardReward {
    address: Address;
    amount: string;
}

export interface BackendRewardsLeaderboardRank {
    account: Address;
    weight: number;
    position: number;
    distributed: BackendLeaderboardReward[];
}

export interface BackendRewardsLeaderboard {
    type: "rewards";
    ranks: BackendRewardsLeaderboardRank[];
}

export interface BackendPointsLeaderboardRank {
    account: Address;
    weight: number;
    position: number;
    distributed: string;
}

export interface BackendPointsLeaderboard {
    type: "points";
    ranks: BackendPointsLeaderboardRank[];
}

export interface BackendLeaderboardResponse {
    resolvedPricedTokens: Record<Address, BackendUsdPricedErc20Token>;
    updatedAt?: number;
    leaderboard: BackendRewardsLeaderboard | BackendPointsLeaderboard;
}
