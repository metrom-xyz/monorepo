import { isAddress } from "viem";
import {
    type AmmPool,
    type Erc20Token,
    Status,
    TargetType,
} from "@metrom-xyz/sdk";
import { type Campaign, FilterableStatus } from "../types/common";

export function sortCampaigns(campaigns: Campaign[]): Campaign[] {
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

    const sorted = clusteredCampaigns[Status.Live];
    sorted.push(...clusteredCampaigns[Status.Upcoming]);
    sorted.push(...clusteredCampaigns[Status.Ended]);

    return sorted;
}

export function filterCampaigns(
    campaigns: Campaign[],
    status: FilterableStatus,
    chainId: number | null,
    searchQuery: string,
): Campaign[] {
    if (campaigns.length === 0) return [];
    if (!searchQuery && status === FilterableStatus.All && !chainId)
        return campaigns;

    let filteredCampaigns = campaigns;

    if (chainId)
        filteredCampaigns = filteredCampaigns.filter(
            (campaign) => campaign.chainId === chainId,
        );

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
