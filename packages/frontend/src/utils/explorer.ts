import { SupportedChain } from "@metrom-xyz/contracts";
import { type Hex } from "viem";
import type { Address } from "blo";
import {
    chainIdToAptosNetwork,
    getChainData,
    getCrossVmChainData,
} from "./chain";
import { APTOS } from "../commons/env";
import { isAddress } from "./address";
import { ChainType } from "@metrom-xyz/sdk";

export function getExplorerLink(
    address: Address,
    chainId?: SupportedChain,
    chainType?: ChainType,
): string | undefined {
    if (!chainType || !chainId || !isAddress(address)) return undefined;

    const explorer = getCrossVmChainData(chainId, chainType)?.blockExplorers
        ?.default;
    if (!explorer) return undefined;

    if (chainType === ChainType.Aptos) {
        const network = chainIdToAptosNetwork(chainId);
        return `${explorer.url}/account/${address}?network=${network}`;
    }
    return `${explorer.url}/address/${address}`;
}

export function getFungibleAssetExplorerLink(
    address: Address,
    chainId?: SupportedChain,
    chainType?: ChainType,
): string | undefined {
    if (!chainType || !chainId || !isAddress(address)) return undefined;

    const explorer = getCrossVmChainData(chainId, chainType)?.blockExplorers
        ?.default;
    if (!explorer) return undefined;

    if (chainType === ChainType.Aptos) {
        const network = chainIdToAptosNetwork(chainId);
        return `${explorer.url}/fungible_asset/${address}?network=${network}`;
    }
    return `${explorer.url}/token/${address}`;
}

export function getTxExplorerLink(
    hash: Hex,
    chainId?: SupportedChain,
): string | undefined {
    if (!chainId) return;

    const explorer = getChainData(chainId)?.blockExplorers?.default;
    if (!explorer) return;

    if (APTOS) {
        const network = chainIdToAptosNetwork(chainId);
        return `${explorer.url}/txn/${hash}?network=${network}`;
    }
    return `${explorer.url}/tx/${hash}`;
}
