import { type Chain } from "viem";
import {
    holesky,
    base,
    baseSepolia,
    taiko,
    scroll,
    sonic,
    gnosis,
    sepolia,
    telos,
    swellchain,
    lightlinkPhoenix,
    sei,
    hemi,
    form,
} from "viem/chains";
import {
    holeskyData,
    sonicData,
    baseData,
    baseSepoliaData,
    taikoData,
    scrollData,
    gnosisData,
    sepoliaData,
    telosData,
    lightlinkPhoenixData,
    seiDevelopmentData,
    // seiProductionData,
    swellDevelopmentData,
    swellProductionData,
    hemiData,
    formData,
} from "./chains";
import {
    ChainData,
    SupportedDevelopmentChain,
    SupportedProductionChain,
} from "./types/chains";
import { Environment } from "@metrom-xyz/sdk";

export {
    Environment,
    SupportedDex,
    BackendCampaignStatus as CampaignStatus,
    Campaign,
} from "@metrom-xyz/sdk";
export { SupportedChain } from "@metrom-xyz/contracts";
export * from "./types/common";
export * from "./types/chains";
export * from "./types/protocol";
export * from "./assets";

export const CHAIN_DATA: {
    [Environment.Development]: Record<SupportedDevelopmentChain, ChainData>;
    [Environment.Production]: Record<SupportedProductionChain, ChainData>;
} = {
    [Environment.Development]: {
        [SupportedDevelopmentChain.Holesky]: holeskyData,
        [SupportedDevelopmentChain.BaseSepolia]: baseSepoliaData,
        [SupportedDevelopmentChain.Sepolia]: sepoliaData,
        [SupportedDevelopmentChain.Swell]: swellDevelopmentData,
        [SupportedDevelopmentChain.Sei]: seiDevelopmentData,
    },
    [Environment.Production]: {
        [SupportedProductionChain.Base]: baseData,
        // [SupportedProductionChain.Mode]: modeData,
        // [SupportedProductionChain.Mantle]: mantleData,
        [SupportedProductionChain.Form]: formData,
        [SupportedProductionChain.Taiko]: taikoData,
        [SupportedProductionChain.Scroll]: scrollData,
        [SupportedProductionChain.Sonic]: sonicData,
        [SupportedProductionChain.Swell]: swellProductionData,
        [SupportedProductionChain.Gnosis]: gnosisData,
        [SupportedProductionChain.Telos]: telosData,
        [SupportedProductionChain.LightLinkPhoenix]: lightlinkPhoenixData,
        // [SupportedProductionChain.Sei]: seiProductionData,
        [SupportedProductionChain.Hemi]: hemiData,
    },
};

export const SUPPORTED_DEVELOPMENT_CHAINS: [Chain, ...Chain[]] = [
    holesky,
    baseSepolia,
    sepolia,
    sei,
    swellchain,
];

export const SUPPORTED_PRODUCTION_CHAINS: [Chain, ...Chain[]] = [
    base,
    taiko,
    scroll,
    sonic,
    form,
    gnosis,
    telos,
    lightlinkPhoenix,
    swellchain,
    hemi,
    // sei,
].sort((a, b) => {
    // keep the active chains first, this way the default selected
    // chain will always be an active one
    const chainDataA = CHAIN_DATA[Environment.Production][a.id];
    const chainDataB = CHAIN_DATA[Environment.Production][b.id];

    return (chainDataB.active ? 1 : 0) - (chainDataA.active ? 1 : 0);
}) as unknown as [Chain, ...Chain[]];
