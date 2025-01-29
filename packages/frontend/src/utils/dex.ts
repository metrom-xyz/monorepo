import {
    SupportedDex,
    TargetType,
    type TargetedCampaign,
} from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import { ProtocolType, type Dex } from "../types";
import { CHAIN_DATA } from "../commons";
import type { Hex } from "viem";
import type { Address } from "blo";

export function getDex(
    chainId: SupportedChain,
    dexSlug: string,
): Dex | undefined {
    return CHAIN_DATA[chainId].protocols[ProtocolType.Dex].find(
        ({ slug }) => slug === dexSlug,
    );
}

export function getPoolAddLiquidityLink(
    campaign: TargetedCampaign<TargetType.AmmPoolLiquidity>,
): string | undefined {
    const { chainId, target } = campaign;

    const dex = getDex(chainId, target.pool.dex.slug);
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
