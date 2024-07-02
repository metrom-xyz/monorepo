import type { SupportedChain } from "@metrom-xyz/contracts";
import { ADDRESS, Environment } from "@metrom-xyz/contracts";

export const METROM_X_ACCOUNT = "https://twitter.com/metromxyz";

export const METROM_TELEGRAM = "https://t.me/metrom_xyz";

export const METROM_MEDIUM = "https://medium.com/@metromxyz";

export const METROM_CONTRACTS_REPO = "https://github.com/metrom-xyz/contracts";

export const METROM_DAPP_LINKS: Record<Environment, string> = {
    [Environment.Development]: "https://app.dev.metrom.xyz",
    [Environment.Staging]: "https://app.staging.metrom.xyz",
};

// TODO: the environment has to be taken in through an env

export const METROM_DAPP_LINK = METROM_DAPP_LINKS[Environment.Development];

export const SUPPORTED_CHAIN_IDS = Object.keys(
    ADDRESS[Environment.Development],
) as unknown as SupportedChain[];
