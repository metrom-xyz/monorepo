<script setup lang="ts">
import { computed } from "vue";
import type { ApproveRewardProps } from "./types";
import {
    useChainId,
    usePublicClient,
    useSimulateContract,
    useWagmiConfig,
} from "vevm";
import { erc20Abi, type Address, parseUnits, formatUnits } from "viem";
import { ref } from "vue";
import { writeContract } from "@wagmi/core";
import SubmitButton from "../../submit-button/SubmitButton.vue";

const props = defineProps<ApproveRewardProps>();

const chainId = useChainId();
const config = useWagmiConfig();
const publicClient = usePublicClient();

const approving = ref(false);

const amountToApprove = parseUnits(
    props.reward.amount.toString(),
    props.reward.token.decimals,
);

const { simulation: simulatedApprove, loading: simulatingApprove } =
    useSimulateContract(
        computed(() => ({
            chainId: chainId.value,
            address: props.reward.token?.address as Address,
            abi: erc20Abi,
            functionName: "approve",
            args: [props.metrom.address, amountToApprove],
        })),
    );

async function handleApproveRewardOnClick() {
    if (!publicClient.value || !simulatedApprove.value) return;

    try {
        approving.value = true;
        const hash = await writeContract(
            config,
            simulatedApprove.value.request,
        );
        await publicClient.value.waitForTransactionReceipt({
            hash,
        });
        props.onApprove();
    } catch (error) {
        console.warn("could not approve reward", error);
    } finally {
        approving.value = false;
    }
}
</script>
<template>
    <SubmitButton
        :loading="$props.loading || simulatingApprove || approving"
        @click="handleApproveRewardOnClick"
    >
        {{ $t("campaign.deploy.approveReward") }}
        {{ formatUnits(amountToApprove, props.reward.token.decimals) }}
        {{ $props.reward.token?.symbol }}
    </SubmitButton>
</template>
<style></style>
