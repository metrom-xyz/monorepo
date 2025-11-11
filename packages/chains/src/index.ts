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
    seiDevelopmentData,
    seiProductionData,
    swellDevelopmentData,
    swellProductionData,
    hemiData,
    mainnetData,
    arbitrumData,
    plasmaData,
} from "./chains";
import {
    ChainData,
    SupportedDevelopmentEvmChain,
    SupportedDevelopmentMvmChain,
    SupportedProductionEvmChain,
    SupportedProductionMvmChain,
} from "./types/chains";
import { Environment } from "@metrom-xyz/sdk";
import {
    aptosDevelopmentData,
    aptosDevelopmentProductionData,
    aptosProductionData,
} from "./chains/aptos";

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

export const EVM_CHAIN_DATA: {
    [Environment.Development]: Record<SupportedDevelopmentEvmChain, ChainData>;
    [Environment.Production]: Record<SupportedProductionEvmChain, ChainData>;
} = {
    [Environment.Development]: {
        [SupportedDevelopmentEvmChain.BaseSepolia]: baseSepoliaData,
        [SupportedDevelopmentEvmChain.Sepolia]: sepoliaData,
        [SupportedDevelopmentEvmChain.Swell]: swellDevelopmentData,
        [SupportedDevelopmentEvmChain.Sei]: seiDevelopmentData,
        [SupportedProductionEvmChain.Katana]: katanaData,
    },
    [Environment.Production]: {
        [SupportedProductionEvmChain.ArbitrumOne]: arbitrumData,
        [SupportedProductionEvmChain.Base]: baseData,
        [SupportedProductionEvmChain.Taiko]: taikoData,
        [SupportedProductionEvmChain.Scroll]: scrollData,
        [SupportedProductionEvmChain.Sonic]: sonicData,
        [SupportedProductionEvmChain.Swell]: swellProductionData,
        [SupportedProductionEvmChain.Gnosis]: gnosisData,
        [SupportedProductionEvmChain.Telos]: telosData,
        [SupportedProductionEvmChain.Lens]: lensData,
        [SupportedProductionEvmChain.LightLinkPhoenix]: lightlinkPhoenixData,
        [SupportedProductionEvmChain.Lumia]: lumiaData,
        [SupportedProductionEvmChain.Mainnet]: mainnetData,
        [SupportedProductionEvmChain.Katana]: katanaData,
        [SupportedProductionEvmChain.Sei]: seiProductionData,
        [SupportedProductionEvmChain.Hemi]: hemiData,
        [SupportedProductionEvmChain.Plasma]: plasmaData,
    },
};

export const MVM_CHAIN_DATA: {
    [Environment.Development]: Record<SupportedDevelopmentMvmChain, ChainData>;
    [Environment.Production]: Record<SupportedProductionMvmChain, ChainData>;
} = {
    [Environment.Development]: {
        [SupportedDevelopmentMvmChain.AptosMainnet]:
            aptosDevelopmentProductionData,
        [SupportedDevelopmentMvmChain.AptosTestnet]: aptosDevelopmentData,
    },
    [Environment.Production]: {
        [SupportedProductionMvmChain.Aptos]: aptosProductionData,
    },
};

// Needed for wagmi context setup, not needed for MVM chains
export const SUPPORTED_DEVELOPMENT_CHAINS: [Chain, ...Chain[]] = [
    baseSepolia,
    sepolia,
    sei,
    swellchain,
    // TODO: this is required for the Katana vault campaigns testing, remove this as soon as that is done
    katana,
];

// Needed for wagmi context setup, not needed for MVM chains
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
    // This is required for the Turtle integration
    mainnet,
    // This is required for the Katana vault campaigns
    katana,
    swellchain,
    hemi,
    sei,
    plasma,
].sort((a, b) => {
    // keep the active chains first, this way the default selected
    // chain will always be an active one
    const chainDataA = EVM_CHAIN_DATA[Environment.Production][a.id];
    const chainDataB = EVM_CHAIN_DATA[Environment.Production][b.id];

    return (chainDataB.active ? 1 : 0) - (chainDataA.active ? 1 : 0);
}) as unknown as [Chain, ...Chain[]];
