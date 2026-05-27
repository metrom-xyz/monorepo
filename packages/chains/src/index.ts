import { type Chain } from "viem";
import {
    base,
    baseSepolia,
    taiko,
    scroll,
    sonic,
    gnosis,
    sepolia,
    telos,
    swellchain,
    lens,
    lightlinkPhoenix,
    lumiaMainnet,
    sei,
    hemi,
    mainnet,
    arbitrum,
    plasma,
    katana,
    linea,
    saga,
    megaeth,
    bsc,
} from "viem/chains";
import {
    sonicData,
    baseData,
    baseSepoliaData,
    taikoData,
    scrollData,
    gnosisData,
    sepoliaData,
    telosData,
    katanaData,
    lensData,
    lightlinkPhoenixData,
    lumiaData,
    seiData,
    swellData,
    hemiData,
    mainnetData,
    arbitrumData,
    plasmaData,
    megaethData,
    lineaData,
    sagaData,
    bscData,
    aptosTestnetData,
    aptosData,
    solanaDevelopmentData,
} from "./chains";
import {
    ChainData,
    SupportedDevelopmentEvmChain,
    SupportedDevelopmentMvmChain,
    SupportedDevelopmentSvmChain,
    SupportedProductionEvmChain,
    SupportedProductionMvmChain,
    SupportedProductionSvmChain,
} from "./types/chains";
import { Environment } from "@metrom-xyz/sdk";

export {
    Environment,
    SupportedDex,
    BackendCampaignStatus as CampaignStatus,
    Campaign,
} from "@metrom-xyz/sdk";
export { SupportedChain } from "@metrom-xyz/contracts";
export * from "./types/chains";
export * from "./types/common";
export * from "./types/forms";
export * from "./types/protocol";
export * from "./assets";
export * from "./fungible-asset-protocols";

export const EVM_CHAIN_DATA: {
    [Environment.Development]: Record<SupportedDevelopmentEvmChain, ChainData>;
    [Environment.Production]: Record<SupportedProductionEvmChain, ChainData>;
} = {
    [Environment.Development]: {
        [SupportedDevelopmentEvmChain.BaseSepolia]: baseSepoliaData,
        [SupportedDevelopmentEvmChain.Sepolia]: sepoliaData,
    },
    [Environment.Production]: {
        [SupportedProductionEvmChain.ArbitrumOne]: arbitrumData,
        [SupportedProductionEvmChain.Base]: baseData,
        [SupportedProductionEvmChain.Taiko]: taikoData,
        [SupportedProductionEvmChain.Scroll]: scrollData,
        [SupportedProductionEvmChain.Sonic]: sonicData,
        [SupportedProductionEvmChain.Swell]: swellData,
        [SupportedProductionEvmChain.Gnosis]: gnosisData,
        [SupportedProductionEvmChain.Telos]: telosData,
        [SupportedProductionEvmChain.Lens]: lensData,
        [SupportedProductionEvmChain.LightLinkPhoenix]: lightlinkPhoenixData,
        [SupportedProductionEvmChain.Lumia]: lumiaData,
        [SupportedProductionEvmChain.Mainnet]: mainnetData,
        [SupportedProductionEvmChain.Katana]: katanaData,
        [SupportedProductionEvmChain.Linea]: lineaData,
        [SupportedProductionEvmChain.Sei]: seiData,
        [SupportedProductionEvmChain.Hemi]: hemiData,
        [SupportedProductionEvmChain.Plasma]: plasmaData,
        [SupportedProductionEvmChain.Saga]: sagaData,
        [SupportedProductionEvmChain.MegaEth]: megaethData,
        [SupportedProductionEvmChain.Bsc]: bscData,
    },
};

export const MVM_CHAIN_DATA: {
    [Environment.Development]: Record<SupportedDevelopmentMvmChain, ChainData>;
    [Environment.Production]: Record<SupportedProductionMvmChain, ChainData>;
} = {
    [Environment.Development]: {
        [SupportedDevelopmentMvmChain.AptosTestnet]: aptosTestnetData,
    },
    [Environment.Production]: {
        [SupportedProductionMvmChain.Aptos]: aptosData,
    },
};

export const SVM_CHAIN_DATA: {
    [Environment.Development]: Record<SupportedDevelopmentSvmChain, ChainData>;
    [Environment.Production]: Record<SupportedProductionSvmChain, ChainData>;
} = {
    [Environment.Development]: {
        [SupportedDevelopmentSvmChain.Testnet]: solanaDevelopmentData,
    },
    [Environment.Production]: {
        // TODO: add production data
        [SupportedProductionSvmChain.Mainnet]: solanaDevelopmentData,
    },
};

// Needed for wagmi context setup, not needed for MVM or SVM chains
export const SUPPORTED_DEVELOPMENT_CHAINS: [Chain, ...Chain[]] = [
    baseSepolia,
    sepolia,
    sei,
    swellchain,
];

// Needed for wagmi context setup, not needed for MVM or SVM chains
export const SUPPORTED_PRODUCTION_CHAINS: [Chain, ...Chain[]] = [
    arbitrum,
    base,
    taiko,
    scroll,
    sonic,
    gnosis,
    telos,
    lens,
    lightlinkPhoenix,
    lumiaMainnet,
    swellchain,
    hemi,
    sei,
    plasma,
    saga,
    megaeth,
    mainnet,
    bsc,
    // These are required for Turtle campaigns
    katana,
    linea,
].sort((a, b) => {
    // keep the active chains first, this way the default selected
    // chain will always be an active one
    const chainDataA = EVM_CHAIN_DATA[Environment.Production][a.id];
    const chainDataB = EVM_CHAIN_DATA[Environment.Production][b.id];

    return (chainDataB.active ? 1 : 0) - (chainDataA.active ? 1 : 0);
}) as unknown as [Chain, ...Chain[]];
