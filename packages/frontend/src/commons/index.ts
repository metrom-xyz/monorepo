import {
    type Erc20Token,
    Environment,
    METROM_API_CLIENT as METROM_API_CLIENTS,
    SupportedAmm,
} from "@metrom-xyz/sdk";
import { type ChainContract, type Chain } from "viem";
import { type Protocol } from "../types/protocol";
import type { SVGIcon } from "../types/common";
import type { FunctionComponent } from "react";
import { SupportedChain } from "@metrom-xyz/contracts";
import { ENVIRONMENT } from "./env";
import SafeAppsSdk from "@safe-global/safe-apps-sdk";
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
    lightlinkPhoenix,
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
} from "./chains";

export interface ChainData {
    testnet: boolean;
    name: string;
    metromContract: ChainContract;
    blockExplorers: Chain["blockExplorers"];
    icon: FunctionComponent<SVGIcon>;
    protocols: Protocol[];
    baseTokens: Erc20Token[];
}

export const BASE_URL = "https://app.metrom.xyz";

export const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;

export const FEE_UNIT = 1_000_000;

export const MAX_U256 =
    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn;

export const METROM_DATA_MANAGER_JWT_ISSUER = "metrom-data-manager";

export const MAXIMUM_REWARDS_RESTRICTIONS = 20;

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] =
    ENVIRONMENT === Environment.Production
        ? [
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
          ]
        : [holesky, baseSepolia, sepolia];

export const TOKEN_ICONS_URL = `https://raw.githubusercontent.com/metrom-xyz/token-icons/refs/heads/main/${ENVIRONMENT === Environment.Production ? "mainnet" : "testnet"}-icons.json`;

export const CHAIN_DATA: Record<SupportedChain, ChainData> = {
    [SupportedChain.Holesky]: holeskyData,
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
    [SupportedChain.Telos]: telosData,
    [SupportedChain.LightLinkPhoenix]: lightlinkPhoenixData,
};

export const AMM_SUPPORTS_RANGE_INCENTIVES: Record<SupportedAmm, boolean> = {
    [SupportedAmm.AlgebraIntegral]: true,
    [SupportedAmm.UniswapV3]: true,
};

export const AMM_SUPPORTS_TOKENS_RATIO: Record<SupportedAmm, boolean> = {
    [SupportedAmm.AlgebraIntegral]: true,
    [SupportedAmm.UniswapV3]: true,
};

// taken from https://github.com/wevm/wagmi/blob/80326815bea2f175623157f57465f9dfae1f4c5c/packages/connectors/src/safe.ts#L45
export const SAFE_CONNECTOR_ID = "safe";

export const METROM_API_CLIENT = METROM_API_CLIENTS[ENVIRONMENT];

export const SAFE_APP_SDK = new SafeAppsSdk();
