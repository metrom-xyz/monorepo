import type { Address, PublicClient } from "viem";
import { CoreClient } from "../core";
import type {
    FetchCampaignsResponse,
    FetchClaimsResponse,
    FetchWhitelistedRewardTokensResponse,
} from "./types";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { SUPPORTED_CHAIN_NAMES, SupportedAmm } from "../../commons";
import type { Campaign, Claim, WhitelistedErc20Token } from "../../entities";

export type FetchCampaignsParams = {
    pageNumber?: number;
    pageSize?: number;
    orderDirection?: "asc" | "desc";
};

export type FetchClaimsParams = {
    address: Address;
    publicClient: PublicClient;
};

export type FetchWhitelistedRewardTokensResult = {
    tokens: Address;
};

export type FetchCampaignsResult = {
    campaigns: Campaign[];
    amount: bigint;
};

export class MetromApiClient extends CoreClient {
    private readonly targetChainName: string;
    private readonly chain: number;

    constructor(
        public readonly baseUrl: string,
        chain: SupportedChain,
    ) {
        super();

        if (!SUPPORTED_CHAIN_NAMES[chain])
            throw new Error(
                `unsupported chain, supported chains are: ${Object.keys(SUPPORTED_CHAIN_NAMES)}`,
            );

        this.chain = parseInt(chain as unknown as string);
        this.targetChainName = SUPPORTED_CHAIN_NAMES[chain];
    }

    async fetchCampaigns(
        params?: FetchCampaignsParams,
    ): Promise<FetchCampaignsResult> {
        const queryParams: Record<string, string | number> = {
            pageNumber: 0,
            pageSize: 10,
            orderDirection: "desc",
            ...Object.fromEntries(
                Object.entries(params || {}).filter(
                    ([, value]) => !!value || !isNaN(Number(value)),
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
                    remaining: BigInt(rawReward.remaining),
                    recovered: BigInt(rawReward.recovered),
                })),
            })),
            amount: BigInt(rawCampaignsResponse.amount),
        };
    }

    async fetchClaims(params: FetchClaimsParams): Promise<Claim[]> {
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

        const rawRewards = (await response.json()) as FetchClaimsResponse;

        const erc20Tokens = await this.fetchErc20Tokens({
            addresses: rawRewards.claims.map((reward) => reward.token),
            publicClient: params.publicClient,
        });

        return rawRewards.claims.map((rawReward) => ({
            ...rawReward,
            token: erc20Tokens[rawReward.token],
            amount: BigInt(rawReward.amount),
            remaining: BigInt(rawReward.remaining),
            proof: rawReward.proof,
        }));
    }

    async fetchWhitelistedRewardTokens(): Promise<WhitelistedErc20Token[]> {
        const response = await fetch(
            new URL(
                `${this.targetChainName}/whitelisted-reward-tokens`,
                this.baseUrl,
            ),
        );
        if (!response.ok)
            throw new Error(
                `response not ok while fetching whitelisted reward tokens: ${await response.text()}`,
            );

        const rawWhitelistedTokens =
            (await response.json()) as FetchWhitelistedRewardTokensResponse;

        return rawWhitelistedTokens.tokens.map((token) => ({
            ...token,
            chainId: this.chain,
            minimumRate: BigInt(token.minimumRate),
        }));
    }
}
