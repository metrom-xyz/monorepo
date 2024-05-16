import { isAddress } from "viem";
import type { TokenInfo } from "@uniswap/token-lists";
import type { Pool } from "sdk";
import type { TokenInfoWithBalance } from "@/components/campaign-creation-form/rewards/types";

export const filterPools = (pools: Pool[], searchQuery: string) => {
    if (pools.length === 0) return [];
    if (!searchQuery) return pools;
    if (isAddress(searchQuery)) {
        const lowercaseSearchQuery = searchQuery.toLowerCase();
        const poolByAddress = pools.find(
            (pool) => pool.address.toLowerCase() === lowercaseSearchQuery,
        );

        if (poolByAddress) return [poolByAddress];

        const tokenByAddress = pools.find(
            (pool) =>
                pool.token0.address.toLowerCase() === lowercaseSearchQuery ||
                pool.token1.address.toLowerCase() === lowercaseSearchQuery,
        );

        return tokenByAddress ? [tokenByAddress] : [];
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
};

export const filterTokens = (tokens: TokenInfo[], searchQuery: string) => {
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

export const sortERC20Tokens = (
    tokens: TokenInfoWithBalance[],
): TokenInfoWithBalance[] => {
    return tokens.sort((a, b) => {
        const balanceA = a.balance;
        const balanceB = b.balance;

        let result = 0;
        if (balanceA && balanceB)
            result = balanceA > balanceB ? -1 : balanceA === balanceB ? 0 : 1;
        else if (balanceA && balanceA > 0n) result = -1;
        else if (balanceB && balanceB > 0n) result = 1;
        if (result !== 0) return result;

        if (a.symbol && b.symbol)
            return a.symbol.toLowerCase() < b.symbol.toLowerCase() ? -1 : 1;
        else return a.symbol ? -1 : b.symbol ? -1 : 0;
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
