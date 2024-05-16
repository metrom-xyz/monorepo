import {
    ref,
    type MaybeRefOrGetter,
    type Ref,
    watchEffect,
    toValue,
} from "vue";
import type { Pool } from "sdk";
import type { Amm } from "@/types";

export interface UsePoolsParams {
    amm?: Amm;
}

export interface UsePoolsReturnType {
    loading: Ref<boolean>;
    error: Ref<Error | undefined>;
    pools: Ref<Pool[] | undefined>;
}

export function usePools(
    params?: MaybeRefOrGetter<UsePoolsParams>,
): UsePoolsReturnType {
    const loading = ref(false);
    const error = ref<Error | undefined>();
    const pools = ref<Pool[] | undefined>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        pools.value = undefined;

        const newParams = toValue(params);
        if (!newParams || !newParams.amm) return;

        try {
            pools.value = await newParams.amm.subgraphClient.fetchPools();
        } catch (thrown) {
            error.value = thrown as Error;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, pools };
}
