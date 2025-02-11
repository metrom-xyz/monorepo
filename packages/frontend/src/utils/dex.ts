import {
    SupportedDex,
    TargetType,
    type TargetedCampaign,
} from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import { ProtocolType, type DexProtocol } from "../types";
import { CHAIN_DATA } from "../commons";
import type { Hex } from "viem";
import type { Address } from "blo";

export function getDex(
    chainId: SupportedChain,
    dexSlug: string,
): DexProtocol | undefined {
    return CHAIN_DATA[chainId].protocols.find(
        ({ type, slug }) => type === ProtocolType.Dex && slug === dexSlug,
    ) as DexProtocol | undefined;
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

    if (SupportedDex.Unagi === dex.slug) {
        const { tokens, fee } = target.pool;
        const url = dex.addLiquidityUrl
            .replace("{target_token_0}", tokens[0].address)
            .replace("{target_token_1}", tokens[1].address);

        return fee ? `${url}&fee=${fee * 10000}` : url;
    }

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
