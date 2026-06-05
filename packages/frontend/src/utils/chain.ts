import {
    EVM_CHAIN_DATA,
    MVM_CHAIN_DATA,
    Environment,
    type ChainData,
    SVM_CHAIN_DATA,
} from "@metrom-xyz/chains";
import { APTOS, ENVIRONMENT, SOLANA } from "../commons/env";
import { Network, NetworkToChainId } from "@aptos-labs/ts-sdk";
import { SupportedChain as SupportedChainMvm } from "@metrom-xyz/aptos-contracts";
import { SupportedChain as SupportedChainSvm } from "@metrom-xyz/programs-solana";
import { ChainType } from "@metrom-xyz/sdk";

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
            throw new Error(`Unsupported solana network ${network}`);
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
        default:
            throw new Error(
                `Unsupported chain type and id: ${chainType}-${chainId}`,
            );
    }
}

export function getChainData(chainId: number): ChainData | undefined {
    const chainType = getChainType();

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
        default:
            throw new Error(
                `Unsupported chain type and id: ${chainType}-${chainId}`,
            );
    }
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
    }
}

export function getChainType() {
    if (APTOS) return ChainType.Aptos;
    if (SOLANA) return ChainType.Svm;
    return ChainType.Evm;
}
