import type { Address } from "viem";
import type { OnChainAmount, UsdPricedErc20TokenAmount } from "./commons";

export interface TokensLeaderboardRank {
    account: Address;
    weight: number;
    position: number;
    distributed: UsdPricedErc20TokenAmount[];
}

export interface RewardsLeaderboard {
    type: "tokens";
    ranks: TokensLeaderboardRank[];
}

export interface PointsLeaderboardRank {
    account: Address;
    weight: number;
    position: number;
    distributed: OnChainAmount;
}

export interface PointsLeaderboard {
    type: "points";
    ranks: PointsLeaderboardRank[];
}

export interface Leaderboard {
    updatedAt?: number;
    leaderboard: RewardsLeaderboard | PointsLeaderboard;
}
