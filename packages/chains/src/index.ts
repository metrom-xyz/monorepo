import { type Chain } from "viem";
import {
    holesky,
    mode,
    mantle,
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
} from "viem/chains";
import {
    holeskyData,
    modeData,
    mantleData,
    sonicData,
    baseData,
    baseSepoliaData,
    taikoData,
    scrollData,
    form,
    formData,
    gnosisData,
    sepoliaData,
    telosData,
    lightlinkPhoenixData,
    seiData,
    swellDevelopmentData,
    swellProductionData,
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

export const SUPPORTED_DEVELOPMENT_CHAINS: [Chain, ...Chain[]] = [
    holesky,
    baseSepolia,
    sepolia,
    sei,
    swellchain,
];

export const SUPPORTED_PRODUCTION_CHAINS: [Chain, ...Chain[]] = [
    mode,
    mantle,
    base,
    taiko,
    scroll,
    sonic,
    form,
    gnosis,
    telos,
    lightlinkPhoenix,
    swellchain,
];

export const CHAIN_DATA: {
    [Environment.Development]: Record<SupportedDevelopmentChain, ChainData>;
    [Environment.Production]: Record<SupportedProductionChain, ChainData>;
} = {
    [Environment.Development]: {
        [SupportedDevelopmentChain.Holesky]: holeskyData,
        [SupportedDevelopmentChain.BaseSepolia]: baseSepoliaData,
        [SupportedDevelopmentChain.Sepolia]: sepoliaData,
        [SupportedDevelopmentChain.Swell]: swellDevelopmentData,
        [SupportedDevelopmentChain.Sei]: seiData,
    },
    [Environment.Production]: {
        [SupportedProductionChain.Base]: baseData,
        [SupportedProductionChain.Mode]: modeData,
        [SupportedProductionChain.Mantle]: mantleData,
        [SupportedProductionChain.Taiko]: taikoData,
        [SupportedProductionChain.Scroll]: scrollData,
        [SupportedProductionChain.Sonic]: sonicData,
        [SupportedProductionChain.Swell]: swellProductionData,
        [SupportedProductionChain.Form]: formData,
        [SupportedProductionChain.Gnosis]: gnosisData,
        [SupportedProductionChain.Telos]: telosData,
        [SupportedProductionChain.LightLinkPhoenix]: lightlinkPhoenixData,
        [SupportedProductionChain.Sei]: seiData,
    },
};
