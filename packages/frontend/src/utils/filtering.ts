import { isAddress } from "./address";
import {
    type AmmPool,
    type CampaignTarget,
    DistributablesType,
    type Erc20Token,
    Status,
    TargetType,
} from "@metrom-xyz/sdk";
import { FilterableStatus } from "../types/common";
import { type Campaign } from "../types/campaign";
import dayjs from "dayjs";

export type CampaignSortOptions = "protocol" | "apr" | "rewards";

export function getCampaignTargetField(target: CampaignTarget) {
    if (target.type === TargetType.AmmPoolLiquidity)
        return target.pool.dex.name;

    if (
        target.type === TargetType.LiquityV2Debt ||
        target.type === TargetType.LiquityV2StabilityPool
    )
        return target.brand.name;

    return "";
}

export function sortCampaigns(
    campaigns: Campaign[],
    sortField?: CampaignSortOptions,
    sortDirection?: number,
): Campaign[] {
    const clusteredCampaigns = campaigns.reduce(
        (clustered: Record<Status, Campaign[]>, campaign) => {
            clustered[campaign.status].push(campaign);
            return clustered;
        },
        {
            [Status.Upcoming]: [],
            [Status.Live]: [],
            [Status.Ended]: [],
        },
    );

    clusteredCampaigns[Status.Live].sort((a, b) => {
        return !a.apr || !b.apr ? b.from - a.from : b.apr - a.apr;
    });
    clusteredCampaigns[Status.Upcoming].sort((a, b) => {
        return a.from - b.from;
    });
    clusteredCampaigns[Status.Ended].sort((a, b) => {
        return b.to - a.to;
    });

    let sorted = clusteredCampaigns[Status.Live];
    sorted.push(...clusteredCampaigns[Status.Upcoming]);
    sorted.push(...clusteredCampaigns[Status.Ended]);

    switch (sortField) {
        case "protocol": {
            sorted.sort((a, b) => {
                const targetFieldA = getCampaignTargetField(a.target);
                const targetFieldB = getCampaignTargetField(b.target);

                return (
                    targetFieldA.localeCompare(targetFieldB, "en") *
                    (sortDirection || 1)
                );
            });
            break;
        }
        case "apr": {
            // When sorting for APR we also filter for live campaigns, since it doesn't make much sense
            // to sort ended campaings with missing APR.
            sorted = sorted.filter(
                (campaign) => campaign.status !== Status.Ended,
            );
            sorted.sort((a, b) => {
                return (
                    (a.apr || 0)
                        .toString()
                        .localeCompare((b.apr || 0).toString(), "en", {
                            numeric: true,
                        }) * (sortDirection || 1)
                );
            });

            break;
        }
        case "rewards": {
            // When sorting for rewards we also filter for live campaigns, since it doesn't make much sense
            // to sort ended campaings with missing rewards.
            sorted = sorted.filter(
                (campaign) => campaign.status !== Status.Ended,
            );
            sorted.sort((a, b) => {
                const targetFieldA =
                    a.distributables.type === DistributablesType.Tokens
                        ? a.distributables.amountUsdValue
                        : 0;

                const targetFieldB =
                    b.distributables.type === DistributablesType.Tokens
                        ? b.distributables.amountUsdValue
                        : 0;

                const daysDurationA =
                    dayjs.unix(a.to).diff(dayjs.unix(a.from), "hours", false) /
                    24;
                const perDayUsdValueA =
                    daysDurationA >= 1 ? targetFieldA / daysDurationA : 0;

                const daysDurationB =
                    dayjs.unix(b.to).diff(dayjs.unix(b.from), "hours", false) /
                    24;
                const perDayUsdValueB =
                    daysDurationB >= 1 ? targetFieldB / daysDurationB : 0;

                return (
                    perDayUsdValueA
                        .toString()
                        .localeCompare(perDayUsdValueB.toString(), "en", {
                            numeric: true,
                        }) * (sortDirection || 1)
                );
            });
            break;
        }
        default: {
            break;
        }
    }

    return sorted;
}

export function filterCampaigns(
    campaigns: Campaign[],
    status: FilterableStatus,
    protocol: string,
    chainId: number | null,
    searchQuery: string,
): Campaign[] {
    if (campaigns.length === 0) return [];
    if (
        !searchQuery &&
        status === FilterableStatus.All &&
        !chainId &&
        protocol === ""
    )
        return campaigns;

    let filteredCampaigns = campaigns;

    if (chainId)
        filteredCampaigns = filteredCampaigns.filter(
            (campaign) => campaign.chainId === chainId,
        );

    if (protocol !== "") {
        filteredCampaigns = filteredCampaigns.filter((campaign) => {
            switch (campaign.target.type) {
                case TargetType.AmmPoolLiquidity: {
                    return campaign.target.pool.dex.slug === protocol;
                }
                case TargetType.LiquityV2Debt:
                case TargetType.LiquityV2StabilityPool: {
                    return campaign.target.brand.slug === protocol;
                }
            }
        });
    }

    if (status !== FilterableStatus.All) {
        let convertedStatus: Status;
        if (status === FilterableStatus.Ended) convertedStatus = Status.Ended;
        else if (status === FilterableStatus.Live)
            convertedStatus = Status.Live;
        else if (status === FilterableStatus.Upcoming)
            convertedStatus = Status.Upcoming;

        filteredCampaigns = filteredCampaigns.filter(
            (campaign) => campaign.status === convertedStatus,
        );
    }

    if (isAddress(searchQuery)) {
        const lowercaseSearchQuery = searchQuery.toLowerCase();

        const campaignByAddress = filteredCampaigns.filter(
            (campaign) =>
                campaign.isTargeting(TargetType.AmmPoolLiquidity) &&
                campaign.target.pool.id.toLowerCase() === lowercaseSearchQuery,
        );

        return campaignByAddress;
    }

    const lowercaseSearchParts = searchQuery
        .trim()
        .toLowerCase()
        .split(/[/\s]+/)
        .filter((s) => s.length > 0 && s !== "/");
    if (lowercaseSearchParts.length === 0) return filteredCampaigns;
    return filteredCampaigns.filter((campaign) => {
        return matchesSearch(campaign.name, lowercaseSearchParts);
    });
}

export const filterPools = (pools: AmmPool[], searchQuery: string) => {
    if (pools.length === 0) return [];
    if (!searchQuery) return pools;
    if (isAddress(searchQuery)) {
        const lowercaseSearchQuery = searchQuery.toLowerCase();
        const poolByAddress = pools.find(
            (pool) => pool.id.toLowerCase() === lowercaseSearchQuery,
        );

        if (poolByAddress) return [poolByAddress];

        const poolByToken = pools.filter((pool) =>
            pool.tokens.some(
                (token) => token.address.toLowerCase() === lowercaseSearchQuery,
            ),
        );

        return poolByToken;
    }

    const lowercaseSearchParts = searchQuery
        .trim()
        .toLowerCase()
        .split(/[/\s]+/)
        .filter((s) => s.length > 0 && s !== "/");
    if (lowercaseSearchParts.length === 0) return pools;
    return pools.filter((pool) => {
        return (
            matchesSearch(
                pool.tokens.map((token) => token.symbol).join(" "),
                lowercaseSearchParts,
            ) ||
            matchesSearch(
                pool.tokens.map((token) => token.name).join(" "),
                lowercaseSearchParts,
            )
        );
    });
};

export const filterTokens = (tokens: Erc20Token[], searchQuery: string) => {
    if (tokens.length === 0) return [];
    if (!searchQuery) return tokens;
    if (isAddress(searchQuery)) {
        const lowercaseSearchQuery = searchQuery.toLowerCase();
        const tokenByAddress = tokens.find(
            (token) => token.address.toLowerCase() === lowercaseSearchQuery,
        );
        return tokenByAddress ? [tokenByAddress] : [];
    }
    const lowercaseSearchParts = searchQuery
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((s) => s.length > 0);
    if (lowercaseSearchParts.length === 0) return tokens;
    return tokens.filter((token) => {
        const { symbol, name } = token;
        return (
            (symbol && matchesSearch(symbol, lowercaseSearchParts)) ||
            (name && matchesSearch(name, lowercaseSearchParts))
        );
    });
};

const matchesSearch = (searched: string, parts: string[]): boolean => {
    const searchedParts = searched
        .toLowerCase()
        .split(/\s+/)
        .filter((s) => s.length > 0);

    return parts.every(
        (part) =>
            part.length === 0 ||
            searchedParts.some((searchedPart) => searchedPart.includes(part)),
    );
};
