import {
    ref,
    type MaybeRefOrGetter,
    type Ref,
    watchEffect,
    toValue,
} from "vue";
import { type MetromApiClient, type Claim } from "sdk";
import type { Address } from "viem";
import { usePublicClient } from "vevm";

export interface useClaims {
    address?: Address;
    client?: MetromApiClient;
}

export interface UseClaimsReturnType {
    loading: Ref<boolean>;
    error: Ref<Error | undefined>;
    claims: Ref<Claim[] | undefined>;
}

export function useClaims(
    params?: MaybeRefOrGetter<useClaims>,
): UseClaimsReturnType {
    const loading = ref(false);
    const error = ref<Error | undefined>();
    const claims = ref<Claim[] | undefined>();

    const publicClient = usePublicClient();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        claims.value = undefined;

        const newParams = toValue(params);
        if (
            !newParams ||
            !newParams.client ||
            !newParams.address ||
            !publicClient.value
        )
            return;

        try {
            claims.value = await newParams.client.fetchClaims({
                address: newParams.address,
                publicClient: publicClient.value,
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
