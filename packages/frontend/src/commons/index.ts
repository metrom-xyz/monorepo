import {
    ChainType,
    Environment,
    METROM_API_CLIENT as METROM_API_CLIENTS,
    SupportedAmm,
    SupportedPointsBooster,
} from "@metrom-xyz/sdk";
import { APTOS, ENVIRONMENT } from "./env";
import SafeAppsSdk from "@safe-global/safe-apps-sdk";
import {
    SUPPORTED_DEVELOPMENT_CHAINS,
    SUPPORTED_PRODUCTION_CHAINS,
} from "@metrom-xyz/chains";
import { NetworkToChainId } from "@aptos-labs/ts-sdk";
import { SupportedChain as SupportedAptosChain } from "@metrom-xyz/aptos-contracts";

export const CHAIN_TYPE = APTOS ? ChainType.Aptos : ChainType.Evm;

export const BASE_URL = "https://app.metrom.xyz";

export const METROM_APTOS_BASE_URL =
    ENVIRONMENT === Environment.Production
        ? "https://aptos.metrom.xyz"
        : "https://aptos.dev.metrom.xyz";

export const TURTLE_API_BASE_URL = "https://earn.turtle.vision";
export const TURTLE_APP_EARN_URL = "https://app.turtle.xyz/earn/opportunities";
export const TURTLE_REFERRAL_CODE = "METROM";

export const YIELDSEEKER_APP_BASE_URL = "https://beta.yieldseeker.xyz";
export const YIELDSEEKER_REFERRAL_CODE = "TRENCHES";
export const YIELDSEEKER_BONUS_PERCENTAGE = 12;

export const POINTS_BOOSTER_REFERRAL_URLS: Record<
    SupportedPointsBooster,
    string
> = {
    [SupportedPointsBooster.LiquidityLand]:
        "https://app.liquidity.land?ref=2AQfO-fN",
};

export const ENSO_WIDGET_REFERRAL_CODE = "6578715329019f91";

export const MIN_LOADING_TIMEOUT_MS = 300;

export const SECONDS_IN_YEAR = 60 * 60 * 24 * 365;

export const FEE_UNIT = 1_000_000;
export const WEIGHT_UNIT = 1_000_000;

export const MAX_U256 =
    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn;

export const METROM_DATA_MANAGER_JWT_ISSUER = "metrom-data-manager";

export const MAXIMUM_REWARDS_RESTRICTIONS = 20;

export const SUPPORTED_CHAINS_EVM =
    ENVIRONMENT === Environment.Production
        ? SUPPORTED_PRODUCTION_CHAINS
        : SUPPORTED_DEVELOPMENT_CHAINS;

export const SUPPORTED_CHAINS_MVM =
    ENVIRONMENT === Environment.Production
        ? [NetworkToChainId[SupportedAptosChain.Mainnet]]
        : [
              NetworkToChainId[SupportedAptosChain.Mainnet],
              NetworkToChainId[SupportedAptosChain.Testnet],
          ];

export const TOKEN_ICONS_URL = `https://raw.githubusercontent.com/metrom-xyz/token-icons/refs/heads/main/${ENVIRONMENT === Environment.Production ? "mainnet" : "testnet"}-icons.json`;

export const AMM_SUPPORTS_RANGE_INCENTIVES: Record<SupportedAmm, boolean> = {
    [SupportedAmm.AlgebraIntegral]: true,
    [SupportedAmm.Velodrome]: true,
    [SupportedAmm.UniswapV3]: true,
    [SupportedAmm.Carbon]: true,
    [SupportedAmm.PancakeV3]: true,
    [SupportedAmm.Izumi]: true,
    [SupportedAmm.BalancerV3]: false,
    [SupportedAmm.Croc]: true,
    [SupportedAmm.Curve]: false,
    [SupportedAmm.Lithos]: false,
    [SupportedAmm.Hyperion]: true,
    [SupportedAmm.Thala]: true,
};

export const AMM_SUPPORTS_TOKENS_RATIO: Record<SupportedAmm, boolean> = {
    [SupportedAmm.AlgebraIntegral]: true,
    [SupportedAmm.Velodrome]: true,
    [SupportedAmm.UniswapV3]: true,
    [SupportedAmm.Carbon]: false,
    [SupportedAmm.PancakeV3]: true,
    [SupportedAmm.Izumi]: true,
    [SupportedAmm.BalancerV3]: false,
    [SupportedAmm.Croc]: true,
    [SupportedAmm.Curve]: false,
    [SupportedAmm.Lithos]: false,
    [SupportedAmm.Hyperion]: true,
    [SupportedAmm.Thala]: true,
};

// taken from https://github.com/wevm/wagmi/blob/80326815bea2f175623157f57465f9dfae1f4c5c/packages/connectors/src/safe.ts#L45
export const SAFE_CONNECTOR_ID = "safe";

export const METROM_API_CLIENT = METROM_API_CLIENTS[ENVIRONMENT];

export const SAFE_APP_SDK = new SafeAppsSdk();
