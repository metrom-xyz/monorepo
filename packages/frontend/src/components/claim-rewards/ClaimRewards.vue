<script setup lang="ts">
import {
    useAccount,
    usePublicClient,
    useSimulateContract,
    useWagmiConfig,
} from "vevm";
import { computed, ref } from "vue";
import type { ClaimRewardsProps } from "./types";
import { CHAIN_DATA } from "@/commons";
import MuiButton from "@/ui/button/MuiButton.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import MuiModal from "@/ui/modal/MuiModal.vue";
import MuiTextField from "@/ui/text-field/MuiTextField.vue";
import MuiRemoteLogo from "@/ui/remote-logo/MuiRemoteLogo.vue";
import { formatUnits } from "viem";
import { formatDecimals } from "sdk";
import metromAbi from "../../abis/metrom";
import { ADDRESS } from "@metrom-xyz/contracts";
import { writeContract } from "@wagmi/core";
import MuiWarningMessage from "@/ui/MuiWarningMessage.vue";
import { useClaims } from "@/composables/useClaims";

const props = defineProps<ClaimRewardsProps>();

const config = useWagmiConfig();
const publicClient = usePublicClient();
const account = useAccount();

const modalOpen = ref(false);
const claiming = ref(false);

const { claims, loading: loadingRewards } = useClaims(
    computed(() => ({
        client: CHAIN_DATA[props.chain].metromApiClient,
        address: account.value.address,
    })),
);

const claimRewardsParams = computed(() => {
    if (!claims.value || !account.value.address) return [];

    return claims.value
        .filter((claim) => claim.remaining > 0n)
        .map((claim) => ({
            campaignId: claim.campaignId,
            token: claim.token.address,
            amount: claim.amount,
            proof: claim.proof,
            receiver: account.value.address!,
        }));
});

const {
    error,
    simulation: simulatedClaimRewards,
    loading: simulatingClaimRewards,
} = useSimulateContract(
    computed(() => ({
        abi: metromAbi,
        address: ADDRESS[props.chain].address,
        functionName: "claimRewards",
        args: [claimRewardsParams.value],
    })),
);

function handleModalOnDismiss() {
    modalOpen.value = false;
}

async function handleClaimRewardsOnClick() {
    if (!publicClient.value || !simulatedClaimRewards.value || error.value)
        return;

    try {
        claiming.value = true;
        const hash = await writeContract(
            config,
            simulatedClaimRewards.value.request,
        );
        await publicClient.value.waitForTransactionReceipt({
            hash,
        });
    } catch (error) {
        console.warn("could not claim rewards", error);
    } finally {
        claiming.value = false;
    }
}
</script>
<template>
    <MuiModal :open="modalOpen" :onDismiss="handleModalOnDismiss">
        <MuiButton
            v-if="account.address"
            sm
            :loading="loadingRewards"
            :disabled="
                loadingRewards || (!loadingRewards && claims?.length === 0)
            "
            @click="modalOpen = true"
        >
            <MuiTypography>
                {{
                    $t("allCampaigns.rewards.available", {
                        total: claimRewardsParams.length || 0,
                    })
                }}
            </MuiTypography>
        </MuiButton>
        <template #modal>
            <div class="claim_rewards__modal">
                <MuiTypography lg>
                    {{ $t("allCampaigns.rewards.overview") }}
                </MuiTypography>
                <div :key="claim.token.address" v-for="claim in claims">
                    <div class="claim_rewards__reward__wrapper">
                        <div class="claim_rewards__reward__token">
                            <MuiRemoteLogo
                                xxl
                                :address="claim.token.address"
                                :defaultText="claim.token.symbol"
                            />
                            <MuiTypography>
                                {{ claim.token.symbol }}
                            </MuiTypography>
                        </div>
                        <MuiTextField
                            :label="$t('allCampaigns.rewards.remaining')"
                            :value="
                                formatDecimals({
                                    number: formatUnits(
                                        claim.remaining,
                                        claim.token.decimals,
                                    ),
                                })
                            "
                        />
                        <MuiTextField
                            :label="$t('allCampaigns.rewards.amount')"
                            :value="
                                formatDecimals({
                                    number: formatUnits(
                                        claim.amount,
                                        claim.token.decimals,
                                    ),
                                })
                            "
                        />
                    </div>
                </div>
                <MuiButton
                    sm
                    :loading="simulatingClaimRewards || claiming"
                    :disabled="error || claimRewardsParams.length === 0"
                    @click="handleClaimRewardsOnClick"
                >
                    <MuiTypography>
                        {{
                            claimRewardsParams.length === 0
                                ? $t("allCampaigns.rewards.nothingToClaim")
                                : $t("allCampaigns.rewards.claim")
                        }}
                    </MuiTypography>
                </MuiButton>
                <MuiWarningMessage
                    v-if="!!error && !!(error as any).shortMessage"
                >
                    <MuiTypography>
                        {{ (error as any).shortMessage }}
                    </MuiTypography>
                </MuiWarningMessage>
            </div>
        </template>
    </MuiModal>
</template>
<style>
.claim_rewards__modal {
    @apply flex flex-col gap-4 w-[440px] bg-white p-5 rounded-[30px] border-2 border-green;
}

.claim_rewards__reward__wrapper {
    @apply flex justify-between items-center;
}

.claim_rewards__reward__token {
    @apply min-w-28 flex gap-3 items-center;
}

.claim_rewards__reward__amounts {
    @apply flex gap-3 items-center;
}

.claim_rewards__campaign__claim__wrapper {
    @apply flex gap-3 items-center;
}
</style>
