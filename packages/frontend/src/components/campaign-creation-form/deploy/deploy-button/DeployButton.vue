<script setup lang="ts">
import { usePublicClient, useSimulateContract, useWagmiConfig } from "vevm";
import metromAbi from "@/abis/metrom";
import type { DeployButtonProps } from "./types";
import { parseUnits, type Address } from "viem";
import { ref } from "vue";
import { writeContract } from "@wagmi/core";
import SubmitButton from "../../submit-button/SubmitButton.vue";
import SendIcon from "@/icons/SendIcon.vue";
import { useRouter } from "vue-router";

const props = defineProps<DeployButtonProps>();
const emits = defineEmits(["deployed"]);

const config = useWagmiConfig();
const publicClient = usePublicClient();
const router = useRouter();

const deploying = ref(false);
const deployed = ref(false);

const { simulation: simulatedCreate, loading: simulatingCreate } =
    useSimulateContract({
        abi: metromAbi,
        address: props.metrom.address,
        functionName: "createCampaigns",
        args: [
            [
                {
                    chainId: BigInt(props.state.network),
                    pool: props.state.pool.address,
                    from: props.state.range.from.unix(),
                    to: props.state.range.to.unix(),
                    // TODO: add specification
                    specification:
                        "0x0000000000000000000000000000000000000000000000000000000000000000",
                    rewards: props.state.rewards.map((reward) => ({
                        token: reward.token.address as Address,
                        amount: parseUnits(
                            reward.amount.toString(),
                            reward.token.decimals,
                        ),
                    })),
                },
            ],
        ],
    });

async function handleDeployOnClick() {
    if (deployed.value) {
        router.push({ name: "campaigns" });
        return;
    }
    if (!publicClient.value || !simulatedCreate.value) return;

    try {
        deploying.value = true;
        const hash = await writeContract(config, simulatedCreate.value.request);
        await publicClient.value.waitForTransactionReceipt({
            hash,
        });
        deployed.value = true;
        emits("deployed");
    } catch (error) {
        console.warn("could not create campaign", error);
    } finally {
        deploying.value = false;
    }
}
</script>
<template>
    <SubmitButton
        :variant="deployed ? 'success' : 'base'"
        :disabled="$props.disabled"
        :loading="simulatingCreate || deploying"
        :onClick="handleDeployOnClick"
        :icon="SendIcon"
    >
        {{
            deployed
                ? $t("campaign.deploy.success")
                : $t("campaign.deploy.launch")
        }}
    </SubmitButton>
</template>
<style></style>
