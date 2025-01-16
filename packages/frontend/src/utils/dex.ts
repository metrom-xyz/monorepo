import { SupportedDex, type Campaign } from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import type { Dex } from "../types";
import { CHAIN_DATA } from "../commons";
import type { Hex } from "viem";
import type { Address } from "blo";

export function getDex(
    chainId: SupportedChain,
    dexSlug: string,
): Dex | undefined {
    return CHAIN_DATA[chainId].dexes.find((dex) => dex.slug === dexSlug);
}

export function getPoolAddLiquidityLink(
    campaign: Campaign,
): string | undefined {
    if (campaign.target.type !== "amm-pool-liquidity") return undefined;

    const { chainId, target } = campaign;

    const dex = getDex(chainId, target.pool.dex);
    if (!dex || !dex.addLiquidityUrl) return;

    if ([SupportedDex.UniswapV3, SupportedDex.Panko].includes(dex.slug))
        return dex.addLiquidityUrl.replace(
            "{target_pool}",
            `${target.pool.tokens.map((token) => token.address).join("/")}`,
        );

    return dex.addLiquidityUrl.replace(
        "{target_pool}",
        `${target.pool.address}`,
    );
}

export function getAddressExplorerLink(
    address: Address,
    chainId?: SupportedChain,
): string | undefined {
    if (!chainId) return;

    const explorer = CHAIN_DATA[chainId].blockExplorers?.default;
    if (!explorer) return;

    return `${explorer.url}/address/${address}`;
}

export function getTxExplorerLink(
    hash: Hex,
    chainId?: SupportedChain,
): string | undefined {
    if (!chainId) return;

    const explorer = CHAIN_DATA[chainId].blockExplorers?.default;
    if (!explorer) return;

    return `${explorer.url}/tx/${hash}`;
}
