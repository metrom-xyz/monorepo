import { isAddress } from "viem";
import type { TokenInfo } from "@uniswap/token-lists";
import type { Pair } from "@/sdk/entities/pair";

export const filterPairs = (pairs: Pair[], searchQuery: string) => {
    if (pairs.length === 0) return [];
    if (!searchQuery) return pairs;
    if (isAddress(searchQuery)) {
        const lowercaseSearchQuery = searchQuery.toLowerCase();
        const pairByAddress = pairs.find(
            (pair) => pair.address.toLowerCase() === lowercaseSearchQuery,
        );

        if (pairByAddress) return [pairByAddress];

        const tokenByAddress = pairs.find(
            (pair) =>
                pair.token0.address.toLowerCase() === lowercaseSearchQuery ||
                pair.token1.address.toLowerCase() === lowercaseSearchQuery,
        );

        return tokenByAddress ? [tokenByAddress] : [];
    }

    const lowercaseSearchParts = searchQuery
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((s) => s.length > 0);
    if (lowercaseSearchParts.length === 0) return pairs;
    return pairs.filter((pair) => {
        const { token0, token1 } = pair;
        return (
            (token0.symbol &&
                matchesSearch(token0.symbol, lowercaseSearchParts)) ||
            (token0.name && matchesSearch(token0.name, lowercaseSearchParts)) ||
            (token1.symbol &&
                matchesSearch(token1.symbol, lowercaseSearchParts)) ||
            (token1.name && matchesSearch(token1.name, lowercaseSearchParts))
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
