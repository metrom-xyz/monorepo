import { type Transport, http, type Chain } from "viem";
import { celoAlfajores } from "viem/chains";

export const MIN_CAMPAIGN_HOURS_DURATION = 2;

export const TOKEN_LISTS = [
    "https://tokens.coingecko.com/xdai/all.json",
    "https://tokens.coingecko.com/celo/all.json",
    "https://celo-org.github.io/celo-token-list/celo.tokenlist.json",
];

export const SUPPORTED_CHAINS: [Chain, ...Chain[]] = [celoAlfajores];

export const SUPPORTED_CHAIN_TRANSPORT: Record<number, Transport> = {
    [celoAlfajores.id]: http(),
};
