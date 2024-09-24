import {
    type Erc20Token,
    MetromApiClient,
    SERVICE_URLS,
    DataManagerClient,
} from "@metrom-xyz/sdk";
import { type ChainContract, type Chain } from "viem";
import { type Amm, type SVGIcon } from "../types";
import type { FunctionComponent } from "react";
import { Environment, SupportedChain } from "@metrom-xyz/contracts";
import { ENVIRONMENT } from "./env";
import {
    celoAlfajores,
    holesky,
    mantleSepoliaTestnet,
    mode,
    mantle,
} from "viem/chains";

import {
    celoAlfajoresData,
    holeskyData,
    mantleSepoliaData,
    modeData,
    mantleData,
    sonicTestnet,
    sonicTestnetData,
    baseData,
} from "./chains";

export interface ChainData {
    metromContract: ChainContract;
    icon: FunctionComponent<SVGIcon>;
    amms: Amm[];
    baseTokens: Erc20Token[];
}

export const MAX_U256 =
    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn;

export const METROM_DATA_MANAGER_JWT_ISSUER = "metrom-data-manager";

export const MAXIMUM_REWARDS_RESTRICTIONS = 20;

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] =
    ENVIRONMENT === Environment.Production
        ? [mode, mantle]
        : [celoAlfajores, holesky, mantleSepoliaTestnet, sonicTestnet];

export const TOKEN_ICONS_URL = `https://raw.githubusercontent.com/metrom-xyz/token-icons/refs/heads/main/${ENVIRONMENT === Environment.Production ? "mainnet" : "testnet"}-icons.json`;

export const CHAIN_DATA: Record<SupportedChain, ChainData> = {
    [SupportedChain.Holesky]: holeskyData,
    [SupportedChain.CeloAlfajores]: celoAlfajoresData,
    [SupportedChain.MantleSepolia]: mantleSepoliaData,
    [SupportedChain.SonicTestnet]: sonicTestnetData,

    [SupportedChain.Mode]: modeData,
    [SupportedChain.Mantle]: mantleData,
    [SupportedChain.Base]: baseData,
};

export const metromApiClient = new MetromApiClient(
    SERVICE_URLS[ENVIRONMENT].metrom,
);

export const dataManagerClient = new DataManagerClient(
    SERVICE_URLS[ENVIRONMENT].dataManager,
);
