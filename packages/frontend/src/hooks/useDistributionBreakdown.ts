import { useEffect, useMemo, useState } from "react";
import type { Address } from "blo";
import { formatUnits, zeroHash, zeroAddress } from "viem";
import {
    type Snapshot,
    type Campaign,
    type UsdPricedErc20TokenAmount,
} from "@metrom-xyz/sdk";
import { dataManagerClient } from "../commons";
import { useReadContract } from "wagmi";
import { useChainData } from "./useChainData";
import { metromAbi } from "@metrom-xyz/contracts/abi";

export interface Distribution {
    percentage: number;
    usdValue: number | null;
    accrued: UsdPricedErc20TokenAmount[];
}

export interface DistributionBreakdown {
    timestamp: number;
    sortedDistributionsByAccount: Record<Address, Distribution>;
}

// helps with percentage calculations
const BI_UNIT = 1_000_000n;
const NUMBER_UNIT = 1_000_000;

// TODO: cache possibilities?
export function useDistributionBreakdown(campaign?: Campaign): {
    loading: boolean;
    breakdown?: DistributionBreakdown;
} {
    const [loading, setLoading] = useState(false);
    const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

    const chainData = useChainData(campaign?.chainId);

    const { isLoading: loadingCampaignData, data: campaignData } =
        useReadContract({
            chainId: campaign?.chainId,
            address: chainData?.metromContract.address,
            abi: metromAbi,
            functionName: "campaignById",
            args: campaign && [campaign.id],
            query: {
                enabled: !!campaign,
                refetchOnWindowFocus: false,
            },
        });

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            if (!cancelled) setLoading(false);
            if (!cancelled) setSnapshot(null);

            if (
                !campaign ||
                loadingCampaignData ||
                !campaignData ||
                campaignData.data === zeroHash
            )
                return;

            try {
                if (!cancelled) setLoading(true);

                const fetchedSnapshot = await dataManagerClient.fetchSnapshot({
                    hash: campaignData.data,
                });

                if (!cancelled) setSnapshot(fetchedSnapshot);
            } catch (error) {
                console.error(
                    `Could not fetch campaign snapshot with hash ${campaignData.data}: ${error}`,
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();
    }, [campaign, campaignData, loadingCampaignData]);

    const breakdown = useMemo(() => {
        if (!snapshot || !campaign) return undefined;

        // quick lookup map for reward tokens
        const tokenAddressToReward = campaign.rewards.reduce(
            (
                accumulator: Record<Address, UsdPricedErc20TokenAmount>,
                reward,
            ) => {
                accumulator[reward.token.address.toLowerCase() as Address] =
                    reward;
                return accumulator;
            },
            {},
        );

        // calculate distributed amount for each reward token as well as
        // total and per-account weight in one loop
        let totalWeight = 0n;
        const totalDistributedAmountByToken: Record<Address, bigint> = {};
        const weightByAccount: Record<Address, bigint> = {};
        for (const leaf of snapshot.leaves) {
            if (leaf.account === zeroAddress) continue;

            totalWeight += leaf.amount;

            if (!totalDistributedAmountByToken[leaf.tokenAddress])
                totalDistributedAmountByToken[leaf.tokenAddress] = leaf.amount;
            else
                totalDistributedAmountByToken[leaf.tokenAddress] += leaf.amount;

            if (!weightByAccount[leaf.account])
                weightByAccount[leaf.account] = leaf.amount;
            else weightByAccount[leaf.account] += leaf.amount;
        }

        // with the total and per account weights we can now calculate the
        // proper distributions
        const distributionByAccount: Record<Address, Distribution> = {};
        for (const [account, weight] of Object.entries(weightByAccount)) {
            const percentage = (weight * BI_UNIT) / totalWeight;

            let totalUsdValue: number | null = 0;
            const accrued = Object.entries(totalDistributedAmountByToken).map(
                ([tokenAddress, totalAmount]) => {
                    const reward =
                        tokenAddressToReward[
                            tokenAddress.toLowerCase() as Address
                        ];
                    const rawAmount = (percentage * totalAmount) / BI_UNIT;
                    const formattedAmount = Number(
                        formatUnits(rawAmount, reward.token.decimals),
                    );

                    const usdValue = reward.token.usdPrice
                        ? reward.token.usdPrice * formattedAmount
                        : null;
                    if (!usdValue) totalUsdValue = null;
                    else if (totalUsdValue !== null) totalUsdValue += usdValue;

                    return <UsdPricedErc20TokenAmount>{
                        ...reward,
                        amount: {
                            raw: rawAmount,
                            formatted: formattedAmount,
                            usdValue,
                        },
                    };
                },
            );

            distributionByAccount[account.toLowerCase() as Address] = {
                percentage: (Number(percentage) / NUMBER_UNIT) * 100,
                accrued,
                usdValue: totalUsdValue,
            };
        }

        const sortedDistributionsByAccount = Object.fromEntries(
            Object.entries(distributionByAccount).sort(
                ([_k1, v1], [_k2, v2]) => {
                    return v2.percentage - v1.percentage;
                },
            ),
        );

        return <DistributionBreakdown>{
            timestamp: snapshot.timestamp,
            sortedDistributionsByAccount,
        };
    }, [campaign, snapshot]);

    return {
        loading: loading || loadingCampaignData,
        breakdown,
    };
}
