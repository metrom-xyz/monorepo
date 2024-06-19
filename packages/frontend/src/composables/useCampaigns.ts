import {
    ref,
    type MaybeRefOrGetter,
    type Ref,
    watchEffect,
    toValue,
} from "vue";
import type { Campaign, MetromApiClient } from "sdk";

export interface UseCampaignsParams {
    pageNumber?: number;
    pageSize?: number;
    client?: MetromApiClient;
}

export interface UseCampaignsReturnType {
    loading: Ref<boolean>;
    error: Ref<Error | undefined>;
    amount: Ref<bigint>;
    campaigns: Ref<Campaign[] | undefined>;
}

export function useCampaigns(
    params?: MaybeRefOrGetter<UseCampaignsParams>,
): UseCampaignsReturnType {
    const loading = ref(false);
    const error = ref<Error | undefined>();
    const amount = ref(0n);
    const campaigns = ref<Campaign[] | undefined>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        campaigns.value = undefined;

        const newParams = toValue(params);
        if (!newParams || !newParams.client) return;

        try {
            const response = await newParams.client.fetchCampaigns({
                pageNumber: newParams.pageNumber,
                pageSize: newParams.pageSize,
            });
            campaigns.value = response.campaigns;
            amount.value = response.amount;
        } catch (thrown) {
            error.value = thrown as Error;
        } finally {
            loading.value = false;
        }
    });

    return {
        loading,
        error,
        amount,
        campaigns,
    };
}
