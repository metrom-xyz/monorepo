import {
    ref,
    type MaybeRefOrGetter,
    type Ref,
    watchEffect,
    toValue,
} from "vue";
import { type MetromApiClient, type ClaimableRewards } from "sdk";
import type { Address } from "viem";
import { usePublicClient } from "vevm";

export interface UseClaimableRewards {
    address?: Address;
    client?: MetromApiClient;
}

export interface UseClaimableRewardsReturnType {
    loading: Ref<boolean>;
    error: Ref<Error | undefined>;
    rewards: Ref<ClaimableRewards[] | undefined>;
}

export function useClaimableRewards(
    params?: MaybeRefOrGetter<UseClaimableRewards>,
): UseClaimableRewardsReturnType {
    const loading = ref(false);
    const error = ref<Error | undefined>();
    const rewards = ref<ClaimableRewards[] | undefined>();

    const publicClient = usePublicClient();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        rewards.value = undefined;

        const newParams = toValue(params);
        if (
            !newParams ||
            !newParams.client ||
            !newParams.address ||
            !publicClient.value
        )
            return;

        try {
            rewards.value = await newParams.client.fetchClaimableRewards({
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
        rewards,
    };
}
