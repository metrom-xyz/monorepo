import type { ClaimableRewards } from "src";
import type { Address, PublicClient } from "viem";
import { CoreClient } from "./core";

export type FetchClaimsParams = {
    address: Address;
    publicClient: PublicClient;
};

type RawClaimableRewards = {
    campaignId: Address;
    claims: {
        token: Address;
        amount: string;
        proof: Address[];
    }[];
};

export class MetromApiClient extends CoreClient {
    constructor(public readonly url: string) {
        super();
    }

    async fetchClaimableRewards(
        params: FetchClaimsParams,
    ): Promise<ClaimableRewards[]> {
        const response = await fetch(
            encodeURI(`${this.url}/claims?address=${params.address}`),
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
