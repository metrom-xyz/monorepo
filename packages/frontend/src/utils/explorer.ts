import { SupportedChain } from "@metrom-xyz/contracts";
import { type Hex, type Address } from "viem";
import {
    chainIdToAptosNetwork,
    chainIdToSolanaNetwork,
    getChainData,
    getCrossVmChainData,
} from "./chain";
import { isAddressOnChainType } from "./address";
import { ChainType } from "@metrom-xyz/sdk";

export function getExplorerLink(
    address: Address,
    chainId?: SupportedChain,
    chainType?: ChainType,
): string | undefined {
    if (!chainType || !chainId || !isAddressOnChainType(address, chainType))
        return undefined;

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
    if (!chainType || !chainId || !isAddressOnChainType(address, chainType))
        return undefined;

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

    const chainData = getChainData(chainId);
    if (!chainData) return;

    const explorer = chainData.blockExplorers?.default;
    if (!explorer) return;

    switch (chainData.type) {
        case ChainType.Evm:
            return `${explorer.url}/tx/${hash}`;
        case ChainType.Aptos: {
            const network = chainIdToAptosNetwork(chainId);
            return `${explorer.url}/txn/${hash}?network=${network}`;
        }
        case ChainType.Svm: {
            const cluster = chainIdToSolanaNetwork(chainId)?.split(":")[1];
            return `${explorer.url}/tx/${hash}?cluster=${cluster}`;
        }
        default:
            return;
    }
}
