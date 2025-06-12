import {
    Environment,
    METROM_API_CLIENT as METROM_API_CLIENTS,
    SupportedAmm,
} from "@metrom-xyz/sdk";
import { type Chain } from "viem";
import { ENVIRONMENT } from "./env";
import SafeAppsSdk from "@safe-global/safe-apps-sdk";
import {
    SUPPORTED_DEVELOPMENT_CHAINS,
    SUPPORTED_PRODUCTION_CHAINS,
} from "@metrom-xyz/chains";

export const BASE_URL = "https://app.metrom.xyz";

export const LIQUIDITY_LAND_REFERRAL_URL =
    "https://app.liquidity.land?ref=2AQfO-fN";

export const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;

export const FEE_UNIT = 1_000_000;
export const WEIGHT_UNIT = 1_000_000;

export const MAX_U256 =
    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn;

export const METROM_DATA_MANAGER_JWT_ISSUER = "metrom-data-manager";

export const MAXIMUM_REWARDS_RESTRICTIONS = 20;

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] =
    ENVIRONMENT === Environment.Production
        ? SUPPORTED_PRODUCTION_CHAINS
        : SUPPORTED_DEVELOPMENT_CHAINS;

export const TOKEN_ICONS_URL = `https://raw.githubusercontent.com/metrom-xyz/token-icons/refs/heads/main/${ENVIRONMENT === Environment.Production ? "mainnet" : "testnet"}-icons.json`;

export const AMM_SUPPORTS_RANGE_INCENTIVES: Record<SupportedAmm, boolean> = {
    [SupportedAmm.AlgebraIntegral]: true,
    [SupportedAmm.UniswapV3]: true,
    [SupportedAmm.Carbon]: true,
};

export const AMM_SUPPORTS_TOKENS_RATIO: Record<SupportedAmm, boolean> = {
    [SupportedAmm.AlgebraIntegral]: true,
    [SupportedAmm.UniswapV3]: true,
    [SupportedAmm.Carbon]: false,
};

// taken from https://github.com/wevm/wagmi/blob/80326815bea2f175623157f57465f9dfae1f4c5c/packages/connectors/src/safe.ts#L45
export const SAFE_CONNECTOR_ID = "safe";

export const METROM_API_CLIENT = METROM_API_CLIENTS[ENVIRONMENT];

export const SAFE_APP_SDK = new SafeAppsSdk();
