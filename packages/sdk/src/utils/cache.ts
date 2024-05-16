import type { Address } from "viem";
import { CACHER } from "../commons";
import type { Erc20Token } from "../entities";

export const erc20TokenCachingKey = (chainId: number, address: Address) =>
    `erc20-${chainId}-${address}`;

export const cacheERC20Token = (token: Erc20Token, validUntil?: number) => {
    if (!validUntil || validUntil < Date.now()) {
        validUntil = Date.now() + 172_800_000; // 2 days by default
    }
    CACHER.set<Erc20Token>(
        erc20TokenCachingKey(token.chainId, token.address),
        {
            chainId: token.chainId,
            address: token.address,
            decimals: token.decimals,
            symbol: token.symbol,
            name: token.name,
        },
        validUntil,
    );
};

export const getCachedERC20Token = (
    chainId: number,
    address: Address,
): Erc20Token | undefined => {
    const erc20Token = CACHER.get<Erc20Token>(
        erc20TokenCachingKey(chainId, address),
    );
    if (!!!erc20Token) return;
    return erc20Token;
};
