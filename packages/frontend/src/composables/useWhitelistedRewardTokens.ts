import {
    ref,
    type Ref,
    watchEffect,
    toValue,
    type MaybeRefOrGetter,
} from "vue";
import { MetromApiClient, type WhitelistedErc20Token } from "sdk";

export interface UseWhitelistedRewardTokensReturnParams {
    client?: MetromApiClient;
}

export interface UseWhitelistedRewardTokensReturnType {
    loading: Ref<boolean>;
    error: Ref<Error | undefined>;
    whitelistedTokens: Ref<WhitelistedErc20Token[] | undefined>;
}

export function useWhitelistedRewardTokens(
    params?: MaybeRefOrGetter<UseWhitelistedRewardTokensReturnParams>,
): UseWhitelistedRewardTokensReturnType {
    const loading = ref(false);
    const error = ref<Error | undefined>();
    const whitelistedTokens = ref<WhitelistedErc20Token[] | undefined>();

    watchEffect(async () => {
        loading.value = true;
        error.value = undefined;
        whitelistedTokens.value = undefined;

        const newParams = toValue(params);
        if (!newParams || !newParams.client) return;

        try {
            whitelistedTokens.value =
                await newParams.client.fetchWhitelistedRewardTokens();
        } catch (thrown) {
            error.value = thrown as Error;
        } finally {
            loading.value = false;
        }
    });

    return {
        loading,
        error,
        whitelistedTokens,
    };
}
