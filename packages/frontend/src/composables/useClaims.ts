import {
    ref,
    type MaybeRefOrGetter,
    type Ref,
    watchEffect,
    toValue,
} from "vue";
import { type MetromApiClient, type Claim } from "@metrom-xyz/sdk";
import type { Address } from "viem";

export interface UseClaims {
    address?: Address;
    client?: MetromApiClient;
}

export interface UseClaimsReturnType {
    loading: Ref<boolean>;
    error: Ref<Error | undefined>;
    claims: Ref<Claim[] | undefined>;
}

export function useClaims(
    params?: MaybeRefOrGetter<UseClaims>,
): UseClaimsReturnType {
    const loading = ref(false);
    const error = ref<Error | undefined>();
    const claims = ref<Claim[] | undefined>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        claims.value = undefined;

        const newParams = toValue(params);
        if (!newParams || !newParams.client || !newParams.address) return;

        try {
            claims.value = await newParams.client.fetchClaims({
                address: newParams.address,
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
