<script setup lang="ts">
import { useClaimableRewards } from "@/composables/useClaimableRewards";
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
import { shortenAddress } from "@/utils/address";
import MuiRemoteLogo from "@/ui/remote-logo/MuiRemoteLogo.vue";
import { formatUnits, type Address } from "viem";
import { formatDecimals } from "sdk";
import metromAbi from "../../abis/metrom";
import { ADDRESS } from "@metrom-xyz/contracts";
import { writeContract } from "@wagmi/core";
import MuiWarningMessage from "@/ui/MuiWarningMessage.vue";

const props = defineProps<ClaimRewardsProps>();

const config = useWagmiConfig();
const publicClient = usePublicClient();
const account = useAccount();

const modalOpen = ref(false);
const claiming = ref(false);

const { rewards, loading: loadingRewards } = useClaimableRewards(
    computed(() => ({
        client: CHAIN_DATA[props.chain].metromApiClient,
        address: account.value.address,
    })),
);

const claimRewardsParams = computed(() => {
    if (!rewards.value || !account.value.address) return [];

    const args = rewards.value.reduce(
        (
            accumulator: {
                campaignId: Address;
                token: Address;
                amount: bigint;
                proof: Address[];
                receiver: Address;
            }[],
            reward,
        ) => {
            accumulator.push(
                ...reward.claims.map((claim) => ({
                    campaignId: reward.campaignId,
                    token: claim.token.address,
                    amount: claim.amount,
                    proof: claim.proof,
                    receiver: account.value.address!,
                })),
            );

            return accumulator;
        },
        [],
    );

    return args;
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
            :disabled="!loadingRewards && rewards?.length === 0"
            @click="modalOpen = true"
        >
            <MuiTypography>
                {{
                    $t("allCampaigns.rewards.available", {
                        total: rewards?.length || 0,
                    })
                }}
            </MuiTypography>
        </MuiButton>
        <template #modal>
            <div class="claim_rewards__modal">
                <div :key="reward.campaignId" v-for="reward in rewards">
                    <div class="claim_rewards__campaign__wrapper">
                        <MuiTextField
                            label="Campaign"
                            :value="shortenAddress(reward.campaignId)"
                        />
                        <MuiTextField label="Claims" />
                        <div
                            :key="claim.token.address"
                            v-for="claim in reward.claims"
                            class="claim_rewards__campaign__claim__wrapper"
                        >
                            <MuiRemoteLogo xxl :address="claim.token.address" />
                            <MuiTypography>
                                {{ claim.token.symbol }}
                            </MuiTypography>
                            <MuiTypography>
                                {{
                                    formatDecimals({
                                        number: formatUnits(
                                            claim.amount,
                                            claim.token.decimals,
                                        ),
                                    })
                                }}
                            </MuiTypography>
                        </div>
                    </div>
                </div>
                <MuiButton
                    sm
                    :loading="simulatingClaimRewards || claiming"
                    :disabled="error"
                    @click="handleClaimRewardsOnClick"
                >
                    {{ $t("allCampaigns.rewards.claim") }}
                </MuiButton>
                <MuiWarningMessage v-if="!!(error as any).shortMessage">
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
    @apply flex flex-col gap-4 w-[440px] bg-white px-8 py-5 rounded-[30px] border-2 border-green;
}

.claim_rewards__campaign__wrapper {
    @apply flex flex-col gap-1;
}

.claim_rewards__campaign__claim__wrapper {
    @apply flex gap-3 items-center;
}
</style>
