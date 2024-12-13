import {
    type Erc20Token,
    MetromApiClient,
    SERVICE_URLS,
    Environment,
} from "@metrom-xyz/sdk";
import {
    type ChainContract,
    type Chain,
    type Address,
    zeroAddress,
} from "viem";
import { type Dex, type SVGIcon } from "../types";
import type { FunctionComponent } from "react";
import { SupportedChain } from "@metrom-xyz/contracts";
import { ENVIRONMENT } from "./env";
import {
    celoAlfajores,
    holesky,
    mantleSepoliaTestnet,
    mode,
    mantle,
    base,
    baseSepolia,
    taiko,
    scroll,
} from "viem/chains";

import {
    celoAlfajoresData,
    holeskyData,
    mantleSepoliaData,
    modeData,
    mantleData,
    sonicBlazeTestnet,
    sonicBlazeTestnetData,
    baseData,
    baseSepoliaData,
    taikoData,
    scrollData,
    formTestnet,
    formTestnetData,
    artheraTestnet,
    artheraTestnetData,
} from "./chains";

export interface ChainData {
    name: string;
    metromContract: ChainContract;
    blockExplorers: Chain["blockExplorers"];
    icon: FunctionComponent<SVGIcon>;
    dexes: Dex[];
    baseTokens: Erc20Token[];
}

export const FEE_UNIT = 1_000_000;

export const MAX_U256 =
    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn;

export const METROM_DATA_MANAGER_JWT_ISSUER = "metrom-data-manager";

export const MAXIMUM_REWARDS_RESTRICTIONS = 20;

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] =
    ENVIRONMENT === Environment.Production
        ? [mode, mantle, base, taiko, scroll]
        : [
              celoAlfajores,
              holesky,
              mantleSepoliaTestnet,
              sonicBlazeTestnet,
              baseSepolia,
              formTestnet,
              artheraTestnet,
          ];

export const TOKEN_ICONS_URL = `https://raw.githubusercontent.com/metrom-xyz/token-icons/refs/heads/main/${ENVIRONMENT === Environment.Production ? "mainnet" : "testnet"}-icons.json`;

export const CHAIN_DATA: Record<SupportedChain, ChainData> = {
    [SupportedChain.Holesky]: holeskyData,
    [SupportedChain.CeloAlfajores]: celoAlfajoresData,
    [SupportedChain.MantleSepolia]: mantleSepoliaData,
    [SupportedChain.BaseSepolia]: baseSepoliaData,
    [SupportedChain.FormTestnet]: formTestnetData,
    [SupportedChain.ArtheraTestnet]: artheraTestnetData,
    [SupportedChain.SonicBlazeTestnet]: sonicBlazeTestnetData,

    [SupportedChain.Base]: baseData,
    [SupportedChain.Mode]: modeData,
    [SupportedChain.Mantle]: mantleData,
    [SupportedChain.Taiko]: taikoData,
    [SupportedChain.Scroll]: scrollData,
};

export const metromApiClient = new MetromApiClient(
    SERVICE_URLS[ENVIRONMENT].metrom,
);
