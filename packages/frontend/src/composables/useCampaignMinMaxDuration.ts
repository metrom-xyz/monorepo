import { useAccount, useWagmiConfig } from "vevm";
import { ref, watchEffect, type Ref, computed } from "vue";
import metromAbi from "@/abis/metrom";
import { readContract } from "@wagmi/core";
import { ADDRESS } from "@metrom-xyz/contracts";

interface Duration {
    min: number;
    max: number;
}

export interface UseCampaignMinMaxDurationType {
    loading: Ref<boolean>;
    error: Ref<Error | undefined>;
    duration: Ref<Duration | undefined>;
}

export const useCampaignMinMaxDuration = (): UseCampaignMinMaxDurationType => {
    const loading = ref(false);
    const error = ref<Error | undefined>();
    const duration = ref<Duration | undefined>();

    const account = useAccount();
    const config = useWagmiConfig();

    const metrom = computed(() => {
        if (!account.value.chainId) return;
        return ADDRESS[__ENVIRONMENT__][account.value.chainId];
    });

    watchEffect(async () => {
        error.value = undefined;
        duration.value = undefined;

        if (!metrom.value) return;
        loading.value = true;

        try {
            const min = await readContract(config, {
                address: metrom.value.address,
                abi: metromAbi,
                functionName: "minimumCampaignDuration",
            });
            const max = await readContract(config, {
                address: metrom.value.address,
                abi: metromAbi,
                functionName: "maximumCampaignDuration",
            });

            duration.value = { min, max };
        } catch (thrown) {
            error.value = thrown as Error;
        } finally {
            loading.value = false;
        }
    });

    return {
        loading,
        error,
        duration,
    };
};
