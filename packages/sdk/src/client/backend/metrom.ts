import type { Address, PublicClient } from "viem";
import { CoreClient } from "../core";
import type { FetchCampaignsResponse, RawClaimableRewards } from "./types";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { SUPPORTED_CHAIN_NAMES, SupportedAmm } from "../../commons";
import type { Campaign, ClaimableRewards } from "../../entities";

export type FetchClaimsParams = {
    address: Address;
    publicClient: PublicClient;
};

export type FetchCampaignsParams = {
    pageNumber?: number;
    pageSize?: number;
    orderBy?: string;
    orderDirection?: "asc" | "desc";
};

export type FetchCampaignsResult = {
    campaigns: Campaign[];
    amount: number;
};

export class MetromApiClient extends CoreClient {
    private readonly targetChainName: string;

    constructor(
        public readonly baseUrl: string,
        public readonly chain: SupportedChain,
    ) {
        super();

        if (!SUPPORTED_CHAIN_NAMES[chain])
            throw new Error(
                `unsupported chain, supported chains are: ${Object.keys(SUPPORTED_CHAIN_NAMES)}`,
            );

        this.targetChainName = SUPPORTED_CHAIN_NAMES[chain];
    }

    async fetchCampaigns(
        params?: FetchCampaignsParams,
    ): Promise<FetchCampaignsResult> {
        const queryParams: Record<string, string | number> = {
            pageNumber: 0,
            pageSize: 10,
            orderBy: "creationTimestamp",
            orderDirection: "desc",
            ...Object.fromEntries(
                Object.entries(params || {}).filter(
                    ([_, value]) => !!value || !isNaN(Number(value)),
                ),
            ),
        };

        const url = new URL(`${this.targetChainName}/campaigns`, this.baseUrl);
        Object.keys(queryParams).forEach((param) => {
            url.searchParams.set(param, queryParams[param].toString());
        });

        const response = await fetch(url);
        if (!response.ok)
            throw new Error(
                `response not ok while fetching campaigns: ${await response.text()}`,
            );

        const rawCampaignsResponse =
            (await response.json()) as FetchCampaignsResponse;

        return {
            campaigns: rawCampaignsResponse.campaigns.map((rawCampaign) => ({
                ...rawCampaign,
                pool: {
                    ...rawCampaign.pool,
                    amm: rawCampaign.pool.amm as SupportedAmm,
                    token0: {
                        ...rawCampaign.pool.token0,
                        chainId: this.chain,
                    },
                    token1: {
                        ...rawCampaign.pool.token1,
                        chainId: this.chain,
                    },
                },
                rewards: rawCampaign.rewards.map((rawReward) => ({
                    ...rawReward,
                    token: {
                        ...rawReward.token,
                        chainId: this.chain,
                    },
                    amount: BigInt(rawReward.amount),
                    claimed: BigInt(rawReward.claimed),
                    unclaimed: BigInt(rawReward.unclaimed),
                })),
            })),
            amount: rawCampaignsResponse.amount,
        };
    }

    async fetchClaimableRewards(
        params: FetchClaimsParams,
    ): Promise<ClaimableRewards[]> {
        const response = await fetch(
            new URL(
                `${this.targetChainName}/claims?address=${params.address}`,
                this.baseUrl,
            ),
        );
        if (!response.ok)
            throw new Error(
                `response not ok while fetching claimable rewards: ${await response.text()}`,
            );

        const rawRewards = (await response.json()) as RawClaimableRewards[];

        const tokenAddresses = rawRewards.reduce(
            (uniqueTokens: Set<string>, reward) => {
                reward.claims.forEach((claim) => {
                    uniqueTokens.add(claim.token);
                });
                return uniqueTokens;
            },
            new Set<string>(),
        );

        const erc20Tokens = await this.fetchErc20Tokens({
            addresses: Array.from(tokenAddresses) as Address[],
            publicClient: params.publicClient,
        });

        return rawRewards.map((rawReward) => ({
            ...rawReward,
            claims: rawReward.claims.map((claim) => ({
                token: erc20Tokens[claim.token],
                amount: BigInt(claim.amount),
                proof: claim.proof,
            })),
        }));
    }
}
