import { type Address, erc20Abi } from "viem";
import { getBalance, readContracts } from "@wagmi/core";
import type { TokenInfoWithBalance } from "@/components/campaign-creation-form/rewards/types";
import {
    ref,
    type MaybeRefOrGetter,
    type Ref,
    watchEffect,
    toValue,
} from "vue";
import { useChainId, useWagmiConfig } from "vevm";
import { isAddress } from "viem/utils";

export interface UseImportableTokenParams {
    debouncedQuery?: string;
    withBalances?: boolean;
    connectedAccountAddress?: string;
}

export interface UseImportableTokenReturnType {
    loading: Ref<boolean>;
    error: Ref<Error | undefined>;
    token: Ref<TokenInfoWithBalance | undefined>;
}

export const useImportableToken = (
    params?: MaybeRefOrGetter<UseImportableTokenParams>,
): UseImportableTokenReturnType => {
    const loading = ref(false);
    const error = ref<Error | undefined>();
    const token = ref<TokenInfoWithBalance | undefined>();

    const chainId = useChainId();
    const config = useWagmiConfig();

    watchEffect(async () => {
        const newParams = toValue(params);

        if (
            !newParams ||
            !newParams.debouncedQuery ||
            !isAddress(newParams.debouncedQuery)
        )
            return;

        loading.value = true;
        error.value = undefined;
        token.value = undefined;

        try {
            const rawImportableToken = await readContracts(config, {
                contracts: [
                    {
                        address: newParams.debouncedQuery as Address,
                        abi: erc20Abi,
                        functionName: "name",
                    },
                    {
                        address: newParams.debouncedQuery as Address,
                        abi: erc20Abi,
                        functionName: "decimals",
                    },
                    {
                        address: newParams.debouncedQuery as Address,
                        abi: erc20Abi,
                        functionName: "symbol",
                    },
                ],
                allowFailure: false,
            });

            token.value = {
                address: newParams.debouncedQuery as Address,
                name: rawImportableToken[0],
                decimals: rawImportableToken[1],
                symbol: rawImportableToken[2],
                chainId: chainId.value,
            };

            if (newParams.withBalances && newParams.connectedAccountAddress) {
                const rawImportableTokenBalance = await getBalance(config, {
                    address: newParams.connectedAccountAddress as Address,
                    token: newParams.debouncedQuery as Address,
                });

                token.value.balance = rawImportableTokenBalance.value;
            }
        } catch (thrown) {
            error.value = thrown as Error;
        } finally {
            loading.value = false;
        }
    });

    return {
        loading,
        error,
        token,
    };
};
