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
import { formatDecimals, type Claim } from "sdk";
import metromAbi from "../../abis/metrom";
import { writeContract } from "@wagmi/core";
import { useClaims } from "@/composables/useClaims";
import MuiSwitch from "@/ui/switch/MuiSwitch.vue";

const props = defineProps<ClaimRewardsProps>();

const config = useWagmiConfig();
const publicClient = usePublicClient();
const account = useAccount();

const modalOpen = ref(false);
const claiming = ref(false);
const showAllClaims = ref(false);

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

const aggregatedClaims = computed(() => {
    if (!claims.value || !account.value.address) return [];

    const collator = new Intl.Collator();

    return Object.values(
        claims.value.reduce((accumulator: Record<string, Claim>, claim) => {
            // avoid mutating the original claims
            const clonedClaim = { ...claim };

            if (!accumulator[claim.token.address]) {
                accumulator[claim.token.address] = clonedClaim;
                return accumulator;
            }

            accumulator[claim.token.address].amount += clonedClaim.amount;
            accumulator[claim.token.address].remaining += clonedClaim.remaining;
            return accumulator;
        }, {}),
    )
        .sort((a, b) => collator.compare(a.token.symbol, b.token.symbol))
        .filter((claim) => showAllClaims.value || claim.remaining > 0n);
});

const {
    error,
    simulation: simulatedClaimRewards,
    loading: simulatingClaimRewards,
} = useSimulateContract(
    computed(() => ({
        abi: metromAbi,
        address: CHAIN_DATA[props.chain].contract.address,
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
                <div class="claim_rewards__header">
                    <MuiTypography lg>
                        {{ $t("allCampaigns.rewards.overview") }}
                    </MuiTypography>
                    <MuiSwitch
                        :label="$t('allCampaigns.rewards.showAll')"
                        v-model="showAllClaims"
                    />
                </div>
                <div
                    v-if="aggregatedClaims.length > 0"
                    class="claim_rewards__list"
                >
                    <div
                        :key="claim.token.address"
                        v-for="claim in aggregatedClaims"
                    >
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
                </div>
                <MuiTypography v-else>
                    {{ $t("allCampaigns.rewards.empty") }}
                </MuiTypography>
                <MuiButton
                    sm
                    :loading="simulatingClaimRewards || claiming"
                    :disabled="error || claimRewardsParams.length === 0"
                    @click="handleClaimRewardsOnClick"
                    class="claim_rewards__button"
                >
                    <MuiTypography>
                        {{
                            claimRewardsParams.length === 0
                                ? $t("allCampaigns.rewards.nothingToClaim")
                                : $t("allCampaigns.rewards.claim")
                        }}
                    </MuiTypography>
                </MuiButton>
            </div>
        </template>
    </MuiModal>
</template>
<style>
.claim_rewards__modal {
    @apply flex flex-col gap-4 w-[440px] min-h-96 max-h-96 bg-white p-5 rounded-[30px] border-2 border-green;
}

.claim_rewards__header {
    @apply flex justify-between items-center;
}

.claim_rewards__list {
    @apply flex flex-col gap-4 h-3/4 overflow-y-auto;
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

.claim_rewards__button {
    @apply mt-auto;
}
</style>
