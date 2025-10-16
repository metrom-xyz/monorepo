import { isAddress } from "./address";
import {
    type AmmPool,
    type CampaignTarget,
    type Erc20Token,
    TargetType,
} from "@metrom-xyz/sdk";

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
