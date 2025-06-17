import { Environment } from "@metrom-xyz/sdk";
import { ENVIRONMENT } from "./env";
import { Chain } from "viem";
import {
    SUPPORTED_DEVELOPMENT_CHAINS,
    SUPPORTED_PRODUCTION_CHAINS,
} from "../../../chains/dist";

// taken from https://github.com/wevm/wagmi/blob/80326815bea2f175623157f57465f9dfae1f4c5c/packages/connectors/src/safe.ts#L45
export const SAFE_CONNECTOR_ID = "safe";

export const TOKEN_ICONS_URL = `https://raw.githubusercontent.com/metrom-xyz/token-icons/refs/heads/main/${ENVIRONMENT === Environment.Production ? "mainnet" : "testnet"}-icons.json`;

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] =
    ENVIRONMENT === Environment.Production
        ? SUPPORTED_PRODUCTION_CHAINS
        : SUPPORTED_DEVELOPMENT_CHAINS;
