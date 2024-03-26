<script setup lang="ts">
import { CHAIN_DATA } from "@/commons";
import MuiAccordionSelect from "@/ui/accordion-select/MuiAccordionSelect.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import type { AmmPickerTypes } from "./types";
import type { AccordionSelectOption } from "@/ui/accordion-select/types";
import type { CampaignState } from "@/views/create-campaign-view/types";
import DexIcon from "@/icons/DexIcon.vue";
import { computed } from "vue";
import { SUPPORTED_CHAIN_OPTIONS } from "./commons";
import { watchEffect } from "vue";

const props = defineProps<AmmPickerTypes>();
const emit = defineEmits<{
    updateState: [state: CampaignState];
    complete: [];
}>();

function handleNetworkOnChange(option: AccordionSelectOption<number>) {
    emit("updateState", {
        ...props.state,
        network: option.value,
    });
}

function handleAmmOnChange(option: AccordionSelectOption<string>) {
    if (!props.state?.network) return;

    const amm = CHAIN_DATA[props.state.network].amms.find(
        (amm) => amm.slug === option.value,
    );

    if (!amm) return;

    emit("updateState", {
        ...props.state,
        amm: amm.slug,
    });
}

const SUPPORTED_AMM_OPTIONS = computed<AccordionSelectOption<string>[]>(() => {
    if (!props.state?.network) return [];

    return CHAIN_DATA[props.state.network].amms.map((amm) => ({
        label: amm.name,
        value: amm.slug,
        icon: amm.logo,
    }));
});

watchEffect(() => {
    if (props.completed || !props.state?.network || !props.state.amm) return;
    emit("complete");
});

// TODO: update accordion icons
</script>
<template>
    <div class="amm_picker__root">
        <MuiAccordionSelect
            :label="$t('campaign.amm.network')"
            :icon="DexIcon"
            :selected="
                $props.state?.network
                    ? SUPPORTED_CHAIN_OPTIONS.find(
                          (chain) => chain.value === $props.state?.network,
                      ) || null
                    : null
            "
            @change="handleNetworkOnChange"
            :options="SUPPORTED_CHAIN_OPTIONS"
        >
            <div class="amm_picker__network_accordion">
                <div class="amm_picker__network_accordion_icon_wrapper">
                    <DexIcon class="amm_picker__network_accordion_icon" />
                </div>
                <MuiTypography>{{ $t("campaign.amm.network") }}</MuiTypography>
            </div>
        </MuiAccordionSelect>
        <div class="amm_picker__divider"></div>
        <MuiAccordionSelect
            :label="$t('campaign.amm.dex')"
            :icon="DexIcon"
            :disabled="!$props.state?.network"
            :selected="
                $props.state?.amm
                    ? SUPPORTED_AMM_OPTIONS.find(
                          (amm) => amm.value === $props.state?.amm,
                      ) || null
                    : null
            "
            @change="handleAmmOnChange"
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
    @apply flex flex-col gap-2;
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
