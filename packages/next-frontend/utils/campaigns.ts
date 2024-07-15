import type { Campaign, Pool } from "@metrom-xyz/sdk";
import { isAddress } from "viem";

export function filterCampaigns(campaigns: Campaign[], searchQuery: string) {
    return campaigns.filter((campaign) => {
        const pools = filterPools([campaign.pool], searchQuery);
        return pools.length > 0;
    });
}

export function filterPools(pools: Pool[], searchQuery: string) {
    if (pools.length === 0) return [];
    if (!searchQuery) return pools;
    if (isAddress(searchQuery)) {
        const lowercaseSearchQuery = searchQuery.toLowerCase();
        const poolByAddress = pools.find(
            (pool) => pool.address.toLowerCase() === lowercaseSearchQuery,
        );

        if (poolByAddress) return [poolByAddress];

        const poolByToken = pools.filter(
            (pool) =>
                pool.token0.address.toLowerCase() === lowercaseSearchQuery ||
                pool.token1.address.toLowerCase() === lowercaseSearchQuery,
        );

        return poolByToken;
    }

    const lowercaseSearchParts = searchQuery
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((s) => s.length > 0 && s !== "/");
    if (lowercaseSearchParts.length === 0) return pools;
    return pools.filter((pool) => {
        const { token0, token1 } = pool;

        return (
            matchesSearch(
                `${token0.symbol} ${token1.symbol}`,
                lowercaseSearchParts,
            ) ||
            matchesSearch(`${token0.name} ${token1.name}`, lowercaseSearchParts)
        );
    });
}

function matchesSearch(searched: string, parts: string[]): boolean {
    const searchedParts = searched
        .toLowerCase()
        .split(/\s+/)
        .filter((s) => s.length > 0);

    return parts.every(
        (part) =>
            part.length === 0 ||
            searchedParts.some((searchedPart) => searchedPart.includes(part)),
    );
}
