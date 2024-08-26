import { BASE_CHAIN_TOKENS, SUPPORTED_AMMS_BY_CHAIN } from "@/commons";
import type { ChainData } from "@/types";
import { ADDRESS, Environment, SupportedChain } from "@metrom-xyz/contracts";
import type { ChainContract } from "viem";

export const buildChainData = () => {
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
    if (
        !environment ||
        !(Object.values(Environment) as string[]).includes(environment)
    )
        throw new Error("An ENVIRONMENT env variable is needed");

    const environmentChains = Object.entries(
        ADDRESS[environment as Environment],
    ) as unknown as [SupportedChain, ChainContract][];

    return environmentChains.reduce(
        (chainData, [chain, contract]) => {
            chainData[chain] = {
                contract,
                amms: SUPPORTED_AMMS_BY_CHAIN[chain],
                baseTokens: BASE_CHAIN_TOKENS[chain],
            };
            return chainData;
        },
        {} as Record<SupportedChain, ChainData>,
    );
};
