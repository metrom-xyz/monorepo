import type { Address } from "viem";
import type {
    FetchCampaignsResponse,
    FetchClaimsResponse,
    FetchWhitelistedRewardTokensResponse,
} from "./types";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { SUPPORTED_CHAIN_NAMES, SupportedAmm } from "../commons";
import type { Campaign, Claim, WhitelistedErc20Token } from "../entities";

export type FetchCampaignsParams = {
    pageNumber?: number;
    pageSize?: number;
    orderDirection?: "asc" | "desc";
};

export type FetchCampaignsResult = {
    campaigns: Campaign[];
    amount: bigint;
};

export type FetchClaimsParams = {
    address: Address;
};

export type FetchWhitelistedRewardTokensResult = {
    tokens: Address;
};

export class MetromApiClient {
    private readonly targetChainName: string;
    private readonly chain: number;

    constructor(
        public readonly baseUrl: string,
        chain: SupportedChain,
    ) {
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
                    // FIXME: map the proper entity
                    usdTvl: 0,
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

        const { claims: rawClaims } =
            (await response.json()) as FetchClaimsResponse;

        return rawClaims.map((rawClaim) => ({
            ...rawClaim,
            token: {
                ...rawClaim.token,
                chainId: this.chain,
            },
            amount: BigInt(rawClaim.amount),
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
