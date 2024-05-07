<script setup lang="ts">
import { SUPPORTED_CHAINS } from "@/commons";
import { isChainSupported } from "@/utils/chain";
import { useAccount } from "vevm";
import { watch } from "vue";
import { watchEffect } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUrlSearchParams } from "@vueuse/core";
import MuiCard from "@/ui/MuiCard.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";

defineSlots<{ default: unknown }>();

const account = useAccount();
const route = useRoute();
const router = useRouter();

const targetLandingChain = ref<number>();
const triedSwitchingAutomatically = ref(false);

const params = useUrlSearchParams();

// set the target landing chain by checking if the chain query parameter exists
// and it's a supported chain, otherwise check if the active chain in the connected wallet
// is supported; if the wallet is not connect or the chain is not supported fallback to the
// default chain
watch(
    [() => route.query, () => params],
    (value) => {
        const chain: number | undefined = Number(value[0].chain?.toString());
        const existingChain = Number(value[1].chain?.toString());

        const chainQueryParam = existingChain || chain;

        let targetChain: number;
        if (!chainQueryParam || !isChainSupported(chainQueryParam)) {
            const activeSupportedChain =
                account.value.chainId &&
                SUPPORTED_CHAINS.some((supportedChain) => {
                    return supportedChain.id === account.value.chainId;
                });

            targetChain = activeSupportedChain
                ? account.value.chainId!
                : SUPPORTED_CHAINS[0].id;
            router.replace({ query: { chain: targetChain } });
        } else {
            const canditateTargetChain = isChainSupported(chainQueryParam)
                ? chainQueryParam
                : null;
            if (!canditateTargetChain) return;
            targetChain = canditateTargetChain;
        }

        targetLandingChain.value = targetChain;
    },
    {
        immediate: true,
    },
);

// automatically switch chain on the connected wallet whenver the target chain is defined
watchEffect(async () => {
    if (!account.value.connector) return;

    try {
        if (
            targetLandingChain.value &&
            account.value.connector?.switchChain &&
            !triedSwitchingAutomatically.value &&
            targetLandingChain.value !== account.value.chainId
        )
            await account.value.connector.switchChain({
                chainId: targetLandingChain.value,
            });
    } catch (error) {
        console.warn("could not automatically switch chain", error);
    } finally {
        triedSwitchingAutomatically.value = true;
    }
});

// sync the chain query param when the connected chain changes
watch(
    () => account.value.chainId,
    (newChain, oldChain) => {
        if (!newChain || !oldChain) return;

        if (newChain !== oldChain)
            router.replace({ query: { chain: newChain } });
    },
);
</script>
<template>
    <MuiCard v-if="!!account.chainId && !isChainSupported(account.chainId)">
        <template #title>
            <MuiTypography medium lg>
                {{ $t("chain.unsupported.title") }}
            </MuiTypography>
        </template>
        <template #content>
            <div class="multi_chain_links__unsupported">
                <MuiTypography>
                    {{ $t("chain.unsupported.content") }}
                </MuiTypography>
            </div>
        </template>
    </MuiCard>
    <MuiCard
        v-else-if="
            !!account.chainId &&
            $route.query.chain &&
            Number($route.query.chain?.toString()) !== account.chainId
        "
    >
        <template #title>
            <MuiTypography medium lg>
                {{ $t("chain.wrong.title") }}
            </MuiTypography>
        </template>
        <template #content>
            <div class="multi_chain_links__wrong">
                <MuiTypography>
                    {{
                        $t("chain.wrong.content", {
                            chainName: SUPPORTED_CHAINS.find(
                                (chain) =>
                                    chain.id ===
                                    Number($route.query.chain?.toString()),
                            )?.name,
                        })
                    }}
                </MuiTypography>
            </div>
        </template>
    </MuiCard>
    <slot
        v-else-if="
            $route.query.chain &&
            isChainSupported($route.query.chain.toString())
        "
    ></slot>
</template>
<style>
.multi_chain_links__unsupported__modal {
    @apply w-1/2;
}

.multi_chain_links__unsupported {
    @apply p-6;
}

.multi_chain_links__wrong {
    @apply p-6;
}
</style>
