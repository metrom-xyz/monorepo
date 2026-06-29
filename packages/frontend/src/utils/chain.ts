import {
    EVM_CHAIN_DATA,
    MVM_CHAIN_DATA,
    Environment,
    type ChainData,
    SVM_CHAIN_DATA,
    SUI_CHAIN_DATA,
} from "@metrom-xyz/chains";
import { APTOS, ENVIRONMENT, SOLANA, SUI } from "../commons/env";
import { Network, NetworkToChainId } from "@aptos-labs/ts-sdk";
import { SupportedChain as SupportedChainMvm } from "@metrom-xyz/aptos-contracts";
import { SupportedChain as SupportedChainSvm } from "@metrom-xyz/programs-solana";
import { SupportedChain as SupportedChainSui } from "@metrom-xyz/sui-contracts";
import { ChainType } from "@metrom-xyz/sdk";
import type { SuiClientTypes } from "@mysten/sui/client";

// TODO: implement networks to chain id conversion for Sui
export const SUI_NETWORK_ID = {
    [Environment.Development]: {
        testnet: suiNetworkToId("testnet"),
    },
    [Environment.Production]: {
        mainnet: suiNetworkToId("mainnet"),
    },
};

export function suiNetworkToId(network?: SuiClientTypes.Network): number {
    switch (network) {
        case "testnet": {
            return SupportedChainSui.Testnet;
        }
        case "mainnet": {
            // FIXME: add mainnet id
            return 1;
        }
        default: {
            throw new Error(`Unsupported Sui network ${network}`);
        }
    }
}

export function chainIdToSuiNetwork(
    chainId?: number,
): SuiClientTypes.Network | null {
    const chain = Object.entries(SUI_NETWORK_ID[ENVIRONMENT]).find(
        ([, id]) => chainId === id,
    );

    if (!chain) return null;
    return chain[0] as SuiClientTypes.Network;
}

export const SOLANA_NETWORK_ID = {
    [Environment.Development]: {
        "solana:devnet": solanaNetworkToId("devnet"),
    },
    [Environment.Production]: {
        "solana:mainnet": solanaNetworkToId("mainnet"),
    },
};

export function solanaNetworkToId(network?: string): number {
    const fullNetwork = `solana:${network}`;

    switch (fullNetwork) {
        case "solana:devnet": {
            return SupportedChainSvm.Devnet;
        }
        case "solana:mainnet": {
            // FIXME: add mainnet id
            return 103;
        }
        default: {
            throw new Error(`Unsupported Solana network ${network}`);
        }
    }
}

export function chainIdToSolanaNetwork(chainId?: number): string | null {
    const chain = Object.entries(SOLANA_NETWORK_ID[ENVIRONMENT]).find(
        ([, id]) => chainId === id,
    );

    if (!chain) return null;
    return chain[0];
}

export const APTOS_NETWORK_ID = {
    [Environment.Development]: {
        [Network.MAINNET]: NetworkToChainId[Network.MAINNET],
        [Network.TESTNET]: NetworkToChainId[Network.TESTNET],
    },
    [Environment.Production]: {
        [Network.MAINNET]: NetworkToChainId[Network.MAINNET],
    },
};

export function aptosNetworkToId(network: string): number {
    return NetworkToChainId[network];
}

export function chainIdToAptosNetwork(
    chainId?: number,
): SupportedChainMvm | null {
    const chain = Object.entries(APTOS_NETWORK_ID[ENVIRONMENT]).find(
        ([, id]) => chainId === id,
    );

    if (!chain) return null;
    return chain[0] as SupportedChainMvm;
}

type ValidatedChainDataMap<C extends string | number> = Record<
    C,
    ChainData | undefined
>;

export function getCrossVmChainData(
    chainId: number,
    chainType: ChainType,
): ChainData | undefined {
    switch (chainType) {
        case ChainType.Evm:
            return (
                EVM_CHAIN_DATA[ENVIRONMENT] as ValidatedChainDataMap<number>
            )[chainId];
        case ChainType.Aptos: {
            const network = chainIdToAptosNetwork(chainId);
            if (!network)
                throw new Error(`Unsupported Aptos chain id ${chainId}`);

            return (
                MVM_CHAIN_DATA[ENVIRONMENT] as ValidatedChainDataMap<string>
            )[network];
        }
        case ChainType.Svm: {
            if (!chainIdToSolanaNetwork(chainId))
                throw new Error(`Unsupported Solana chain id ${chainId}`);

            return (
                SVM_CHAIN_DATA[ENVIRONMENT] as ValidatedChainDataMap<number>
            )[chainId];
        }
        case ChainType.Sui: {
            if (!chainIdToSuiNetwork(chainId))
                throw new Error(`Unsupported Sui chain id ${chainId}`);

            return (
                SUI_CHAIN_DATA[ENVIRONMENT] as ValidatedChainDataMap<number>
            )[chainId];
        }
        default:
            throw new Error(
                `Unsupported chain type and id: ${chainType}-${chainId}`,
            );
    }
}

export function getChainData(chainId: number): ChainData | undefined {
    return getCrossVmChainData(chainId, getChainType());
}

export function getChainDataBySlug(slug: string): ChainData | undefined {
    const chainType = getChainType();

    switch (chainType) {
        case ChainType.Evm:
            return Object.values(EVM_CHAIN_DATA[ENVIRONMENT]).find(
                (data) => data.slug === slug,
            );
        case ChainType.Aptos:
            return Object.values(MVM_CHAIN_DATA[ENVIRONMENT]).find(
                (data) => data.slug === slug,
            );
        case ChainType.Svm:
            return Object.values(SVM_CHAIN_DATA[ENVIRONMENT]).find(
                (data) => data.slug === slug,
            );
        case ChainType.Sui:
            return Object.values(SUI_CHAIN_DATA[ENVIRONMENT]).find(
                (data) => data.slug === slug,
            );
        default:
            throw new Error(`Unsupported chain type: ${chainType}`);
    }
}

export function getChainType(): ChainType {
    if (APTOS) return ChainType.Aptos;
    if (SOLANA) return ChainType.Svm;
    if (SUI) return ChainType.Sui;
    return ChainType.Evm;
}
