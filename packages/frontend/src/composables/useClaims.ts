import {
    ref,
    type MaybeRefOrGetter,
    type Ref,
    watchEffect,
    toValue,
} from "vue";
import {
    type MetromApiClient,
    type Claim,
    type SupportedChain,
} from "@metrom-xyz/sdk";
import type { Address } from "viem";
import { useChainId, usePublicClient } from "vevm";
import { CHAIN_DATA } from "@/commons";
import { metromAbi } from "@metrom-xyz/contracts/abi";

export interface ClaimWithRemaining extends Claim {
    remaining: bigint;
}

export interface UseClaims {
    address?: Address;
    client?: MetromApiClient;
}

export interface UseClaimsReturnType {
    loading: Ref<boolean>;
    error: Ref<Error | undefined>;
    claims: Ref<ClaimWithRemaining[]>;
}

export function useClaims(
    params?: MaybeRefOrGetter<UseClaims>,
): UseClaimsReturnType {
    const chainId = useChainId();
    const publicClient = usePublicClient();

    const loading = ref(false);
    const error = ref<Error | undefined>();
    const claims = ref<ClaimWithRemaining[]>([]);

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        claims.value = [];

        const newParams = toValue(params);
        const client = toValue(publicClient);
        if (!client || !newParams || !newParams.client || !newParams.address)
            return;

        try {
            const rawClaims = await newParams.client.fetchClaims({
                address: newParams.address,
            });
            const claimedAggregate = await client.multicall({
                allowFailure: false,
                contracts: rawClaims.map((rawClaim) => {
                    return {
                        address:
                            CHAIN_DATA[chainId.value as SupportedChain].contract
                                .address,
                        abi: metromAbi,
                        functionName: "claimedCampaignReward",
                        args: [
                            rawClaim.campaignId,
                            rawClaim.token.address,
                            newParams.address,
                        ],
                    };
                }),
            });
            claims.value = rawClaims.map((rawClaim, i) => {
                const claimed = claimedAggregate[i] as unknown as bigint;

                return {
                    ...rawClaim,
                    claimed,
                    remaining: rawClaim.amount - claimed,
                };
            });
        } catch (thrown) {
            error.value = thrown as Error;
        } finally {
            loading.value = false;
        }
    });

    return {
        loading,
        error,
        claims,
    };
}
