import { isAddress } from "viem";
import type { Pair } from "../pair-select/types";

export const filterPairs = (pairs: Pair[], searchQuery: string) => {
    if (pairs.length === 0) return [];
    if (!searchQuery) return pairs;
    if (isAddress(searchQuery)) {
        const lowercaseSearchQuery = searchQuery.toLowerCase();
        const pairByAddress = pairs.find(
            (pair) => pair.id.toLowerCase() === lowercaseSearchQuery,
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
