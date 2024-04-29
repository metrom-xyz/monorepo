<script setup lang="ts">
import MuiAccordionSelect from "@/ui/accordion-select/MuiAccordionSelect.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import type { AmmPickerTypes } from "./types";
import type { AccordionSelectOption } from "@/ui/accordion-select/types";
import DexIcon from "@/icons/DexIcon.vue";
import { computed } from "vue";
import { watchEffect } from "vue";
import { CHAIN_DATA } from "@/commons";

const props = defineProps<AmmPickerTypes>();
const emits = defineEmits<{
    complete: [];
    error: [boolean];
}>();

const SUPPORTED_AMM_OPTIONS = computed<AccordionSelectOption<string>[]>(() => {
    if (!props.state.network) return [];

    return CHAIN_DATA[props.state.network].amms.map((amm) => ({
        label: amm.name,
        value: amm.slug,
        icon: amm.logo,
    }));
});

watchEffect(() => {
    emits(
        "error",
        props.completed && (!props.state.network || !props.state.amm),
    );

    if (props.completed || !props.state.network || !props.state.amm) return;
    emits("complete");
});
</script>
<template>
    <div class="amm_picker__root">
        <MuiAccordionSelect
            :label="$t('campaign.amm.dex')"
            :icon="DexIcon"
            :disabled="!$props.state.network"
            v-model="$props.state.amm"
            :options="SUPPORTED_AMM_OPTIONS"
        >
            <div class="amm_picker__network_accordion">
                <div class="amm_picker__network_accordion_icon_wrapper">
                    <DexIcon class="amm_picker__network_accordion_icon" />
                </div>
                <MuiTypography>{{ $t("campaign.amm.dex") }}</MuiTypography>
            </div>
        </MuiAccordionSelect>
    </div>
</template>
<style>
.amm_picker__root {
    @apply flex flex-col gap-2 p-3;
}

.amm_picker__divider {
    @apply h-[1px] border-b border-gray-400;
}

.amm_picker__network_accordion {
    @apply flex gap-2 items-center;
}

.amm_picker__network_accordion_icon_wrapper {
    @apply p-1.5 bg-green-light rounded-full;
}

.amm_picker__network_accordion_icon {
    @apply w-5 h-5;
}
</style>
