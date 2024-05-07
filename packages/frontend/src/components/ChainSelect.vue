<script setup lang="ts">
import { CHAIN_DATA, SUPPORTED_CHAINS } from "@/commons";
import MuiSelect from "@/ui/select/MuiSelect.vue";
import type { SelectOption } from "@/ui/select/types";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { isChainSupported } from "@/utils/chain";
import { useAccount } from "vevm";
import { computed } from "vue";
import { useRouter } from "vue-router";

const account = useAccount();
const router = useRouter();

const SUPPORTED_CHAIN_OPTIONS = computed(() => {
    return SUPPORTED_CHAINS.map((chain) => ({
        label: chain.name,
        value: chain.id,
        icon: CHAIN_DATA[chain.id].icon.logo,
    }));
});

async function handleNetworkOnChange(option: SelectOption<number>) {
    try {
        await account.value.connector?.switchChain?.({ chainId: option.value });
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
            <MuiTypography>{{ $t("chain.unsupported.title") }}</MuiTypography>
        </div>
        <MuiSelect
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
                SUPPORTED_CHAIN_OPTIONS.find(
                    (chain) =>
                        chain.value === Number($route.query.chain?.toString()),
                )?.icon || undefined
            "
            @change="handleNetworkOnChange"
            class="chain_select"
        >
            <template #option="{ option }">
                <div
                    class="chain_select__option"
                    :class="{ chain_select__option_selected: option.selected }"
                >
                    <component
                        :is="option.icon"
                        class="chain_select__option__icon"
                    >
                    </component>
                    <MuiTypography>{{ option.label }}</MuiTypography>
                </div>
            </template>
        </MuiSelect>
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
