import {
    ref,
    type MaybeRefOrGetter,
    type Ref,
    watchEffect,
    toValue,
} from "vue";
import { type MetromApiClient, type Claim } from "@metrom-xyz/sdk";
import type { Address } from "viem";
import { useChainId, useReadContracts } from "vevm";
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
    claims: Ref<Claim[]>;
}

export function useClaims(
    params?: MaybeRefOrGetter<UseClaims>,
): UseClaimsReturnType {
    const chainId = useChainId();

    const loading = ref(false);
    const error = ref<Error | undefined>();
    const rawClaims = ref<Claim[]>([]);
    const claims = ref<ClaimWithRemaining[]>([]);

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        rawClaims.value = [];

        const newParams = toValue(params);
        if (!newParams || !newParams.client || !newParams.address) return;

        try {
            rawClaims.value = await newParams.client.fetchClaims({
                address: newParams.address,
            });
        } catch (thrown) {
            error.value = thrown as Error;
        } finally {
            loading.value = false;
        }
    });

    const { data, loading: loadingClaimed } = useReadContracts({
        allowFailure: false,
        contracts: toValue(params)?.address
            ? rawClaims.value.map((rawClaim) => {
                  return {
                      address: CHAIN_DATA[chainId.value].contract.address,
                      abi: metromAbi,
                      functionName: "claimedCampaignReward",
                      args: [
                          rawClaim.campaignId,
                          rawClaim.token.address,
                          toValue(params)!.address,
                      ],
                  };
              })
            : [],
    });

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        claims.value = [];

        if (!loadingClaimed || !data) return;
        const claimedData = toValue(data);
        if (!claimedData || claimedData.length != rawClaims.value.length)
            return;

        try {
            claims.value = rawClaims.value.map((rawClaim, i) => {
                const claimed = claimedData[i] as unknown as bigint;

                return {
                    ...rawClaim,
                    claimed,
                };
            });
        } catch (thrown) {
            error.value = thrown as Error;
        } finally {
            loading.value = false;
        }
    });

    return {
        loading: ref(loading.value || loadingClaimed.value),
        error,
        claims,
    };
}
