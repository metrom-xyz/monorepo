import { SUPPORTED_AMMS, SUPPORTED_CHAIN_ICONS } from "@/commons";
import type { ChainData } from "@/types";
import { ADDRESS, SupportedChain } from "@metrom-xyz/contracts";
import { MetromApiClient, SERVICE_URLS } from "sdk";

export const buildChainData = () => {
    const environmentChains = Object.keys(
        ADDRESS[__ENVIRONMENT__],
    ) as unknown as SupportedChain[];

    return environmentChains.reduce(
        (chainData, chain) => {
            chainData[chain] = {
                icon: {
                    logo: SUPPORTED_CHAIN_ICONS[chain],
                    backgroundColor: "#000",
                },
                contract: ADDRESS[__ENVIRONMENT__][chain],
                metromApiClient: new MetromApiClient(
                    SERVICE_URLS[__ENVIRONMENT__].metrom,
                    chain,
                ),
                amms: SUPPORTED_AMMS[chain],
            };
            return chainData;
        },
        {} as Record<SupportedChain, ChainData>,
    );
};
