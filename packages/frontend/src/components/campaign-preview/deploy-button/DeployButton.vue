<script setup lang="ts">
import { usePublicClient, useSimulateContract, useWagmiConfig } from "vevm";
import { metromAbi } from "@metrom-xyz/contracts/abi";
import type { DeployButtonProps } from "./types";
import { type Address, type Hex } from "viem";
import { ref } from "vue";
import { writeContract } from "@wagmi/core";
import SubmitButton from "../../submit-button/SubmitButton.vue";
import SendIcon from "@/icons/SendIcon.vue";
import { useRouter } from "vue-router";
import { SERVICE_URLS } from "@metrom-xyz/sdk";
import { useLogin } from "@/stores/auth";
import { computed } from "vue";
import { watchEffect } from "vue";

const props = defineProps<DeployButtonProps>();
const emits = defineEmits(["deployed"]);

const config = useWagmiConfig();
const publicClient = usePublicClient();
const { push } = useRouter();
const { jwtToken } = useLogin();

const uploadingSpecification = ref(false);
const deploying = ref(false);
const deployed = ref(false);
const specificationHash = ref<Hex>(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
);

const { simulation: simulatedCreate, loading: simulatingCreate } =
    useSimulateContract(
        computed(() => ({
            abi: metromAbi,
            address: props.metrom.address,
            functionName: "createCampaigns",
            args: [
                [
                    {
                        pool: props.state.pool.address,
                        from: props.state.range.from.unix(),
                        to: props.state.range.to.unix(),
                        specification: specificationHash.value,
                        rewards: props.state.rewards.map((reward) => ({
                            token: reward.token.address as Address,
                            amount: reward.amount,
                        })),
                    },
                ],
            ],
        })),
    );

watchEffect(() => {
    const uploadSpecification = async () => {
        uploadingSpecification.value = true;
        try {
            const response = await fetch(
                `${SERVICE_URLS[__ENVIRONMENT__].dataManager}/data/temporary`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}` || "",
                    },
                    body: JSON.stringify(props.state.specification),
                },
            );
            if (!response.ok) throw new Error(await response.text());

            const { hash } = (await response.json()) as { hash: Hex };
            specificationHash.value = `0x${hash}`;
        } catch (error) {
            console.error(
                `could not upload specification to data-manager: ${JSON.stringify(props.state.specification)}`,
                error,
            );
        } finally {
            uploadingSpecification.value = false;
        }
    };

    if (props.state.specification) uploadSpecification();
});

async function handleDeployOnClick() {
    if (deployed.value) {
        push({ name: "campaigns" });
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
        variant="success"
        :disabled="$props.disabled"
        :loading="uploadingSpecification || simulatingCreate || deploying"
        :onClick="handleDeployOnClick"
        :icon="SendIcon"
    >
        {{
            deployed
                ? $t("campaign.preview.success")
                : $t("campaign.preview.launch")
        }}
    </SubmitButton>
</template>
<style></style>
