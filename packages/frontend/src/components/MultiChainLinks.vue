<script setup lang="ts">
import { SUPPORTED_CHAINS } from "@/commons";
import { isChainSupported } from "@/utils/chain";
import { useAccount, useChainId, useReconnect } from "vevm";
import { watch } from "vue";
import { watchEffect } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUrlSearchParams } from "@vueuse/core";
import { MetTypography, MetCard } from "@metrom-xyz/ui";
import { onMounted } from "vue";
import { computed } from "vue";

defineSlots<{ default: unknown }>();

const account = useAccount();
const { reconnect } = useReconnect();
const route = useRoute();
const router = useRouter();
const params = useUrlSearchParams();

const targetLandingChain = ref<number>();
const triedSwitchingAutomatically = ref(false);

const unsupported = computed(
    () => !!account.value.chainId && !isChainSupported(account.value.chainId),
);
const wrong = computed(
    () =>
        !!account.value.chainId &&
        route.query.chain &&
        Number(route.query.chain?.toString()) !== account.value.chainId,
);

onMounted(() => {
    if (
        account.value &&
        account.value.isDisconnected &&
        !account.value.isReconnecting
    )
        reconnect({});
});

// set the target landing chain by checking if the chain query parameter exists
// and it's a supported chain, otherwise check if the active chain in the connected wallet
// is supported; if the wallet is not connect or the chain is not supported fallback to the
// default chain
watch(
    [() => route.query, () => params, () => account.value.chainId],
    (value) => {
        const chain: number | undefined = Number(value[0].chain?.toString());
        const existingChain = Number(value[1].chain?.toString());

        const chainQueryParam = existingChain || chain;

        let targetChain: number;
        if (!chainQueryParam || !isChainSupported(chainQueryParam)) {
            // get chain id from the wagmi store
            const chainId: number = JSON.parse(
                localStorage.getItem("wagmi.store") || "''",
            ).state.chainId;

            const activeSupportedChain =
                account.value.chainId &&
                SUPPORTED_CHAINS.some((supportedChain) => {
                    return supportedChain.id === account.value.chainId;
                });

            targetChain = activeSupportedChain
                ? account.value.chainId!
                : chainId || SUPPORTED_CHAINS[0].id;
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

// automatically switch chain on the connected wallet whenever the target chain is defined
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
    <MetCard v-if="unsupported">
        <template #title>
            <MetTypography medium lg>
                {{ $t("chain.unsupported.title") }}
            </MetTypography>
        </template>
        <template #content>
            <div class="multi_chain_links__unsupported">
                <MetTypography>
                    {{ $t("chain.unsupported.content") }}
                </MetTypography>
            </div>
        </template>
    </MetCard>
    <MetCard v-else-if="wrong">
        <template #title>
            <MetTypography medium lg>
                {{ $t("chain.wrong.title") }}
            </MetTypography>
        </template>
        <template #content>
            <div class="multi_chain_links__wrong">
                <MetTypography>
                    {{
                        $t("chain.wrong.content", {
                            chainName: SUPPORTED_CHAINS.find(
                                (chain) =>
                                    chain.id ===
                                    Number($route.query.chain?.toString()),
                            )?.name,
                        })
                    }}
                </MetTypography>
            </div>
        </template>
    </MetCard>
    <div v-else-if="!unsupported && !wrong">
        <slot></slot>
    </div>
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
