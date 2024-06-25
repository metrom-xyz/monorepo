<script setup lang="ts">
import { CHAIN_DATA, SUPPORTED_CHAINS } from "@/commons";
import { MetSelect, type SelectOption, MetTypography } from "@metrom-xyz/ui";
import { isChainSupported } from "@/utils/chain";
import { useAccount, useSwitchChain } from "vevm";
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { SupportedChain } from "sdk";

const account = useAccount();
const router = useRouter();
const { switchChain } = useSwitchChain();

const SUPPORTED_CHAIN_OPTIONS = computed<SelectOption<SupportedChain>[]>(() => {
    return SUPPORTED_CHAINS.map((chain) => ({
        label: chain.name,
        value: chain.id,
    }));
});

async function handleNetworkOnChange(option: SelectOption<SupportedChain>) {
    try {
        await account.value.connector?.switchChain?.({ chainId: option.value });
        switchChain({ chainId: option.value });
    } catch (error) {
        console.warn("could not switch network", error);
    }
    router.replace({ query: { chain: option.value } });
}
</script>
<template>
    <div class="chain_select__root">
        <div
            v-if="
                $route.query.chain &&
                !isChainSupported($route.query.chain?.toString())
            "
            class="chain_select__unsupported__network"
        >
            <MetTypography>{{ $t("chain.unsupported.title") }}</MetTypography>
        </div>
        <MetSelect
            v-else
            :messages="{ noResults: '' }"
            :options="SUPPORTED_CHAIN_OPTIONS"
            :selected="
                SUPPORTED_CHAIN_OPTIONS.find(
                    (chain) =>
                        chain.value === Number($route.query.chain?.toString()),
                ) || null
            "
            :icon="
                CHAIN_DATA[
                    Number($route.query.chain?.toString()) as SupportedChain
                ]?.icon.logo || undefined
            "
            @change="
                (option) =>
                    handleNetworkOnChange(
                        option as SelectOption<SupportedChain>,
                    )
            "
            class="chain_select"
        >
            <template #option="{ option }">
                <div
                    class="chain_select__option"
                    :class="{ chain_select__option_selected: option.selected }"
                >
                    <component
                        :is="
                            CHAIN_DATA[option.value as SupportedChain].icon.logo
                        "
                        class="chain_select__option__icon"
                    >
                    </component>
                    <MetTypography>{{ option.label }}</MetTypography>
                </div>
            </template>
        </MetSelect>
    </div>
</template>
<style>
.chain_select {
    @apply h-14;
}

.chain_select__unsupported__network {
    @apply h-14 w-fit bg-white rounded-xxl flex items-center p-4;
}

.chain_select {
    @apply rounded-[38px] max-w-40;
}

.chain_select__option {
    @apply flex
        gap-3
        items-center
        cursor-pointer
        p-3
        h-12
        font-inter
        font-normal
        outline-none
        placeholder-opacity-20
        text-black
        hover:bg-gray-200;
}

.chain_select__option_selected {
    @apply bg-gray-300 hover:bg-gray-300;
}

.chain_select__option__icon {
    @apply w-8 h-8;
}
</style>
