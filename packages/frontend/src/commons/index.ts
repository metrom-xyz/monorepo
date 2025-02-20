import {
    type Erc20Token,
    MetromApiClient,
    SERVICE_URLS,
    Environment,
    SupportedAmm,
} from "@metrom-xyz/sdk";
import { type ChainContract, type Chain } from "viem";
import { type Protocol, type SVGIcon } from "../types";
import type { FunctionComponent } from "react";
import { SupportedChain } from "@metrom-xyz/contracts";
import { ENVIRONMENT } from "./env";
import {
    celoAlfajores,
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
} from "viem/chains";
import {
    celoAlfajoresData,
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
} from "./chains";

export interface ChainData {
    name: string;
    metromContract: ChainContract;
    blockExplorers: Chain["blockExplorers"];
    icon: FunctionComponent<SVGIcon>;
    protocols: Protocol[];
    baseTokens: Erc20Token[];
}

export const FEE_UNIT = 1_000_000;

export const MAX_U256 =
    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn;

export const METROM_DATA_MANAGER_JWT_ISSUER = "metrom-data-manager";

export const MAXIMUM_REWARDS_RESTRICTIONS = 20;

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] =
    ENVIRONMENT === Environment.Production
        ? [mode, mantle, base, taiko, scroll, sonic, form, gnosis]
        : [celoAlfajores, holesky, baseSepolia, sepolia];

export const TOKEN_ICONS_URL = `https://raw.githubusercontent.com/metrom-xyz/token-icons/refs/heads/main/${ENVIRONMENT === Environment.Production ? "mainnet" : "testnet"}-icons.json`;

export const CHAIN_DATA: Record<SupportedChain, ChainData> = {
    [SupportedChain.Holesky]: holeskyData,
    [SupportedChain.CeloAlfajores]: celoAlfajoresData,
    [SupportedChain.BaseSepolia]: baseSepoliaData,
    [SupportedChain.Sepolia]: sepoliaData,

    [SupportedChain.Base]: baseData,
    [SupportedChain.Mode]: modeData,
    [SupportedChain.Mantle]: mantleData,
    [SupportedChain.Taiko]: taikoData,
    [SupportedChain.Scroll]: scrollData,
    [SupportedChain.Sonic]: sonicData,
    [SupportedChain.Form]: formData,
    [SupportedChain.Gnosis]: gnosisData,
};

export const AMM_SUPPORTS_RANGE_INCENTIVES: Record<SupportedAmm, boolean> = {
    [SupportedAmm.ConcentratedLiquidityV3]: true,
    [SupportedAmm.StableSwap]: false,
};

export const metromApiClient = new MetromApiClient(
    SERVICE_URLS[ENVIRONMENT].metrom,
);
