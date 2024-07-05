import {
    BASE_CHAIN_TOKENS,
    SUPPORTED_AMMS,
    SUPPORTED_CHAIN_ICONS,
} from "@/commons";
import type { ChainData } from "@/types";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { MetromApiClient, SERVICE_URLS } from "@metrom-xyz/sdk";
import type { ChainContract } from "viem";

export const buildChainData = () => {
    const environmentChains = Object.entries(
        ADDRESS[__ENVIRONMENT__],
    ) as unknown as [SupportedChain, ChainContract][];

    return environmentChains.reduce(
        (chainData, [chain, contract]) => {
            chainData[chain] = {
                icon: {
                    logo: SUPPORTED_CHAIN_ICONS[chain],
                    backgroundColor: "#000",
                },
                contract,
                metromApiClient: new MetromApiClient(
                    SERVICE_URLS[__ENVIRONMENT__].metrom,
                    chain,
                ),
                amms: SUPPORTED_AMMS[chain],
                popularTokens: BASE_CHAIN_TOKENS[chain],
            };
            return chainData;
        },
        {} as Record<SupportedChain, ChainData>,
    );
};
