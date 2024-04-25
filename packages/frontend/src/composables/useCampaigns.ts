import {
    ref,
    type MaybeRefOrGetter,
    type Ref,
    watchEffect,
    toValue,
} from "vue";
import type { Campaign, MetromSubgraphClient } from "sdk";

export interface UseCampaignsParams {
    client?: MetromSubgraphClient;
}

export interface UseCampaignsReturnType {
    loading: Ref<boolean>;
    error: Ref<Error | undefined>;
    campaigns: Ref<Campaign[] | undefined>;
}

export function useCampaigns(
    params?: MaybeRefOrGetter<UseCampaignsParams>,
): UseCampaignsReturnType {
    const loading = ref(false);
    const error = ref<Error | undefined>();
    const campaigns = ref<Campaign[] | undefined>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        campaigns.value = undefined;

        const newParams = toValue(params);
        if (!newParams || !newParams.client) return;

        try {
            campaigns.value = await newParams.client.fetchCampaigns();
        } catch (thrown) {
            error.value = thrown as Error;
        } finally {
            loading.value = false;
        }
    });

    return {
        loading,
        error,
        campaigns,
    };
}
