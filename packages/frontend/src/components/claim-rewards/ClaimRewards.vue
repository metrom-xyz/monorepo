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
import {
    MetButton,
    MetTypography,
    MetModal,
    MetSwitch,
    MetAccordion,
} from "@metrom-xyz/ui";
import { type Claim } from "@metrom-xyz/sdk";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import { writeContract } from "@wagmi/core";
import { useClaims } from "@/composables/useClaims";
import ClaimRow from "./row/ClaimRow.vue";

interface MergedClaim {
    merged: Claim;
    list: Claim[];
}

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
    if (!account.value.address) return [];

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

const mergedClaims = computed(() => {
    if (!claims.value || !account.value.address) return [];

    const collator = new Intl.Collator();

    return Object.values(
        claims.value.reduce((acc: Record<string, MergedClaim>, claim) => {
            if (!acc[claim.token.address]) {
                acc[claim.token.address] = {
                    merged: { ...claim },
                    list: [claim],
                };
                return acc;
            }

            acc[claim.token.address].merged.amount += claim.amount;
            acc[claim.token.address].merged.remaining += claim.remaining;
            acc[claim.token.address].list.push(claim);
            return acc;
        }, {}),
    )
        .sort((a, b) =>
            collator.compare(a.merged.token.symbol, b.merged.token.symbol),
        )
        .filter((claim) => showAllClaims.value || claim.merged.remaining > 0n);
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
    <MetModal :open="modalOpen" :onDismiss="handleModalOnDismiss">
        <MetButton
            v-if="account.address"
            sm
            :loading="loadingRewards"
            :disabled="
                loadingRewards || (!loadingRewards && claims?.length === 0)
            "
            @click="modalOpen = true"
        >
            <MetTypography>
                {{ $t("allCampaigns.rewards.rewards") }}
            </MetTypography>
        </MetButton>
        <template #modal>
            <div class="claim_rewards__modal">
                <div class="claim_rewards__header">
                    <MetTypography lg>
                        {{ $t("allCampaigns.rewards.overview") }}
                    </MetTypography>
                    <MetSwitch
                        :label="$t('allCampaigns.rewards.showAll')"
                        v-model="showAllClaims"
                    />
                </div>
                <div v-if="mergedClaims.length > 0" class="claim_rewards__list">
                    <div
                        :key="mergedClaim.merged.token.address"
                        v-for="mergedClaim in mergedClaims"
                        class="claim_rewards__claim__wrapper"
                    >
                        <MetAccordion v-if="mergedClaim.list.length > 1">
                            <template #summary>
                                <ClaimRow
                                    :claim="mergedClaim.merged"
                                    logo
                                    xxl
                                />
                            </template>
                            <div class="claim_rewards__claim__accordion">
                                <div
                                    :key="index"
                                    v-for="(claim, index) in mergedClaim.list"
                                    class="claim_rewards__claim__details"
                                >
                                    <ClaimRow :claim="claim" logo />
                                </div>
                            </div>
                        </MetAccordion>
                        <div v-else class="claim_rewards__claim__no__details">
                            <ClaimRow :claim="mergedClaim.merged" logo xxl />
                        </div>
                    </div>
                </div>
                <div v-else class="claim_rewards__list__empty">
                    <MetTypography>
                        {{ $t("allCampaigns.rewards.empty") }}
                    </MetTypography>
                </div>
                <div class="claim_rewards__footer">
                    <MetButton
                        sm
                        :loading="simulatingClaimRewards || claiming"
                        :disabled="error || claimRewardsParams.length === 0"
                        @click="handleClaimRewardsOnClick"
                    >
                        <MetTypography>
                            {{
                                claimRewardsParams.length === 0
                                    ? $t("allCampaigns.rewards.nothingToClaim")
                                    : $t("allCampaigns.rewards.claim")
                            }}
                        </MetTypography>
                    </MetButton>
                </div>
            </div>
        </template>
    </MetModal>
</template>
<style>
.claim_rewards__modal {
    @apply flex
        flex-col
        gap-5
        w-full
        sm:min-w-[630px]
        h-[600px]
        min-h-96
        bg-white
        rounded-[30px]
        border
        border-green;
}

.claim_rewards__header {
    @apply flex justify-between items-center px-5 pt-5;
}

.claim_rewards__list {
    @apply flex
        flex-col
        flex-1
        gap-2
        h-3/4
        overflow-y-auto
        px-5
        border-y;
}

.claim_rewards__list__empty {
    @apply flex justify-center items-center flex-1;
}

.claim_rewards__claim__wrapper {
    @apply flex flex-col gap-3;
}

.claim_rewards__claim__wrapper
    > .met_accordion__root
    > .met_accordion_summary__root {
    @apply transition-all
        ease-in-out 
        duration-200
        bg-green-200
        hover:bg-green
        border-none;
}

.claim_rewards__reward__token {
    @apply min-w-28 flex gap-3 items-center;
}

.claim_rewards__claim__accordion {
    @apply w-full flex flex-col gap-3;
}

.claim_rewards__claim__details {
    @apply w-full flex justify-between items-center;
}

.claim_rewards__claim__no__details {
    @apply border rounded-[18px] px-4 py-3;
}

.claim_rewards__reward__amounts {
    @apply flex gap-3 items-center;
}

.claim_rewards__campaign__claim__wrapper {
    @apply flex gap-3 items-center;
}

.claim_rewards__footer {
    @apply px-5 pb-5;
}
</style>
