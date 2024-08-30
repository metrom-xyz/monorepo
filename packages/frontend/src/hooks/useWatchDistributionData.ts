import { useEffect, useMemo, useState } from "react";
import type { Address } from "blo";
import { formatUnits } from "viem";
import {
    type DistributionData,
    type Campaign,
    type TokenAmount,
} from "@metrom-xyz/sdk";
import {
    useWatchRewardDistributionEvent,
    type RewardDistribution,
} from "./useWatchRewardDistributionEvent";
import { useCampaignDataHash } from "./useCampaignDataHash";
import { dataManagerClient } from "../commons";

export interface AggregatedEnrichedDistributionData {
    account: Address;
    amount: number;
    rank: number;
    usdValue: number | null;
    details: EnrichedDistributionData[];
}

export interface EnrichedDistributionData extends TokenAmount {
    account: Address;
    rank: number;
    usdValue: number | null;
}

// TODO: cache possibilities?
export function useWatchDistributionData(campaign?: Campaign): {
    loadingData: boolean;
    loadingEvent: boolean;
    distributionData?: AggregatedEnrichedDistributionData[];
    lastDistribution?: RewardDistribution;
} {
    const [loading, setLoading] = useState(false);
    const [distributionData, setDistributionData] =
        useState<DistributionData[]>();

    const { loading: loadingCampaignDataHash, hash: dataHash } =
        useCampaignDataHash(campaign);
    const { loading: loadingDistributionEvent, distribution } =
        useWatchRewardDistributionEvent(campaign);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!cancelled) setLoading(false);
            if (!cancelled) setDistributionData(undefined);

            if (!campaign || !dataHash) return;

            try {
                if (!cancelled) setLoading(true);

                const fetchedDistributionData =
                    await dataManagerClient.fetchDistributionData({
                        hash: dataHash,
                    });

                if (!cancelled) setDistributionData(fetchedDistributionData);
            } catch (error) {
                console.error(
                    `Could not fetch campaign distribution data for hash ${dataHash}: ${error}`,
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();
    }, [campaign, dataHash, distribution?.timestamp]);

    const enrichedDistributionData = useMemo(() => {
        if (!distributionData || !campaign) return undefined;

        const totalDistributedRewardsAmount = campaign.rewards.reduce(
            (acc, reward) => (acc += reward.amount - reward.remaining),
            0,
        );

        const aggregatedDistributionData = distributionData.reduce(
            (acc, data) => {
                if (!acc[data.account]) {
                    acc[data.account] = [];
                }
                acc[data.account].push(data);
                return acc;
            },
            {} as Record<Address, DistributionData[]>,
        );

        // TODO: improve this
        return Object.values(aggregatedDistributionData)
            .map((data) => {
                let totalDistributionUsdValue = 0;
                let totalDistributionAmount = 0;

                const details: EnrichedDistributionData[] = data.map((leaf) => {
                    const rewardedToken = campaign.rewards.find(
                        (reward) => reward.address === leaf.tokenAddress,
                    );

                    // should never happen
                    if (!rewardedToken)
                        throw new Error(
                            `Rewarded token ${leaf.tokenAddress} missing from campaign rewards`,
                        );

                    const amount = Number(
                        formatUnits(leaf.amount, rewardedToken.decimals),
                    );
                    const usdValue = rewardedToken.usdPrice
                        ? amount * rewardedToken.usdPrice
                        : 0;

                    totalDistributionUsdValue += usdValue;
                    totalDistributionAmount += amount;

                    const detailedRank =
                        (amount /
                            (rewardedToken.amount - rewardedToken.remaining)) *
                        100;

                    return {
                        account: leaf.account,
                        token: rewardedToken,
                        rank: detailedRank,
                        amount,
                        usdValue,
                    };
                });

                const totalRank =
                    (totalDistributionAmount / totalDistributedRewardsAmount) *
                    100;

                return {
                    account: details[0].account,
                    amount: totalDistributionAmount,
                    rank: totalRank,
                    usdValue: totalDistributionUsdValue,
                    details,
                };
            })
            .sort(
                (a, b) => b.rank - a.rank,
            ) as AggregatedEnrichedDistributionData[];

        // return distributionData
        //     .map((data) => {
        //         // TODO: improve this
        //         const rewardedToken = campaign.rewards.find(
        //             (reward) => reward.address === data.tokenAddress,
        //         );

        //         // should never happen
        //         if (!rewardedToken)
        //             throw new Error(
        //                 `Rewarded token ${data.tokenAddress} missing from campaign rewards`,
        //             );

        //         const amount = Number(
        //             formatUnits(data.amount, rewardedToken.decimals),
        //         );

        //         return {
        //             account: data.account,
        //             token: rewardedToken,
        //             rank: (amount / totalDistributedRewardsAmount) * 100,
        //             amount,
        //             usdValue: rewardedToken.usdPrice
        //                 ? amount * rewardedToken.usdPrice
        //                 : null,
        //         };
        //     })
        //     .sort((a, b) => b.rank - a.rank) as EnrichedDistributionData[];
    }, [campaign, distributionData]);

    return {
        loadingData: loading || loadingCampaignDataHash,
        loadingEvent: loadingDistributionEvent,
        distributionData: enrichedDistributionData,
        lastDistribution: distribution,
    };
}
