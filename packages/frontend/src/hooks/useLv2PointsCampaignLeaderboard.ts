import type { Address } from "viem";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import type { HookBaseParams } from "../types/hooks";
import type { Leaderboard, Rank } from "../types/campaign";
import { type SupportedLiquityV2 } from "@metrom-xyz/sdk";
import { ENVIRONMENT } from "../commons/env";
import type { Lv2BackendLeaderboardResponse } from "../types/lv2-points-campaign";
import { LV2_SERVICE_BASE_URLS } from "../commons/lv2-points";

interface UseLv2PointsCampaignLeaderboardParams extends HookBaseParams {
    protocol?: SupportedLiquityV2;
}

type QueryKey = [string, SupportedLiquityV2, Address | undefined];

export function useLv2PointsCampaignLeaderboard({
    protocol,
    enabled = true,
}: UseLv2PointsCampaignLeaderboardParams = {}): {
    loading: boolean;
    leaderboard?: Leaderboard;
} {
    const { address } = useAccount();

    const { data, isPending } = useQuery({
        queryKey: ["lv2-points-leaderboard", protocol, address],
        queryFn: async ({ queryKey }) => {
            const [, protocol, account] = queryKey as QueryKey;
            if (!protocol) return null;

            try {
                const url = new URL(
                    "/api/v1/points/leaderboard",
                    LV2_SERVICE_BASE_URLS[ENVIRONMENT](protocol),
                );

                url.searchParams.set("page", "1");
                url.searchParams.set("pageSize", "5");

                if (account) url.searchParams.set("account", account);

                const response = await fetch(url);
                if (!response.ok)
                    throw new Error(
                        `response not ok while fetching lv2 points campaign leaderboard for ${protocol}: ${await response.text()}`,
                    );

                const { items, totalItems } =
                    (await response.json()) as Lv2BackendLeaderboardResponse;

                if (!items || totalItems === 0) return null;

                const sortedRanks = items.map((rank) => {
                    return <Rank>{
                        ...rank,
                        weight: rank.weight * 100,
                        usdValue: null,
                        distributed: rank.distributed,
                    };
                });
                sortedRanks.sort((a, b) => b.weight - a.weight);

                const connectedAccountRankIndex = items.findIndex(
                    (rank) => rank.account === account?.toLowerCase(),
                );

                const connectedAccountRank =
                    connectedAccountRankIndex !== -1
                        ? items.length <= 5
                            ? items[connectedAccountRankIndex]
                            : items.splice(connectedAccountRankIndex, 1)[0]
                        : undefined;

                return <Leaderboard>{
                    connectedAccountRank,
                    sortedRanks,
                };
            } catch (error) {
                console.error(
                    `Could not fetch leaderboard for lv2 points campaign leaderboard for ${protocol}: ${error}`,
                );
                throw error;
            }
        },
        enabled: enabled && !!protocol,
        refetchOnWindowFocus: false,
    });

    return {
        loading: isPending,
        leaderboard: data || undefined,
    };
}
