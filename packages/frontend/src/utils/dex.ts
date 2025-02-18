import {
    TargetType,
    type AmmPool,
    type TargetedCampaign,
} from "@metrom-xyz/sdk";
import { SupportedChain } from "@metrom-xyz/contracts";
import { DepositUrlType, ProtocolType, type DexProtocol } from "../types";
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

export function generateDepositUrl(
    pool: AmmPool,
    baseUrl: string,
    type: DepositUrlType,
) {
    switch (type) {
        case DepositUrlType.PathPoolAddress: {
            return baseUrl.replace("{pool}", `${pool.address}`);
        }
        case DepositUrlType.PathTokenAddresses: {
            return baseUrl.replace(
                "{pool}",
                `${pool.tokens.map(({ address }) => address).join("/")}`,
            );
        }
        case DepositUrlType.QueryTokenAddresses: {
            const { tokens, fee } = pool;
            const url = baseUrl
                .replace("{token_0}", tokens[0].address)
                .replace("{token_1}", tokens[1].address);

            return fee ? `${url}&fee=${fee * 10000}` : url;
        }
    }
}

export function getPoolAddLiquidityLink(
    campaign: TargetedCampaign<TargetType.AmmPoolLiquidity>,
): string | undefined {
    const { chainId, target } = campaign;

    const dex = getDex(chainId, target.pool.dex.slug);
    if (!dex) return undefined;

    return generateDepositUrl(
        campaign.target.pool,
        dex.depositUrl.template,
        dex.depositUrl.type,
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
