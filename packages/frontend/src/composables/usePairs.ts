import {
    ref,
    type MaybeRefOrGetter,
    type Ref,
    watchEffect,
    toValue,
} from "vue";
import type { Pair } from "../sdk/entities/pair";
import { AmmClient } from "@/sdk";
import type { SupportedAmm } from "@/types";

export interface UsePairsParams {
    chainId?: number;
    amm?: SupportedAmm;
    tokenParts?: string;
}

export interface UsePairsReturnType {
    loading: Ref<boolean>;
    error: Ref<Error | undefined>;
    pairs: Ref<Pair[] | undefined>;
}

export function usePairs(
    params?: MaybeRefOrGetter<UsePairsParams>,
): UsePairsReturnType {
    const loading = ref(false);
    const error = ref<Error | undefined>();
    const pairs = ref<Pair[] | undefined>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        pairs.value = undefined;

        const newParams = toValue(params);
        if (!newParams || !newParams.chainId || !newParams.amm) return;

        try {
            pairs.value = await AmmClient.fetchPairs({
                chainId: newParams.chainId,
                amm: newParams.amm,
                tokenParts: newParams.tokenParts,
            });
        } catch (thrown) {
            error.value = thrown as Error;
        } finally {
            loading.value = false;
        }
    });

    return { loading, error, pairs };
}
