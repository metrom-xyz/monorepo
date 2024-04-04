<script setup lang="ts">
import type { DatePickerTypes } from "./types";
import { watchEffect } from "vue";
import MuiDateRangeInput from "@/ui/date-range-input/MuiDateRangeInput.vue";

const props = defineProps<DatePickerTypes>();
const emit = defineEmits<{
    complete: [];
}>();

watchEffect(() => {
    if (props.completed || !props.state.range?.from || !props.state.range.to)
        return;
    emit("complete");
});
</script>
<template>
    <div class="date_picker__root">
        <MuiDateRangeInput
            :messages="{
                startLabel: $t('campaign.range.picker.startLabel'),
                endLabel: $t('campaign.range.picker.endLabel'),
                startPlaceholder: $t('campaign.range.picker.startPlaceholder'),
                endPlaceholder: $t('campaign.range.picker.endPlaceholder'),
            }"
            v-model:range="$props.state.range"
        />
    </div>
</template>
<style>
.date_picker__root {
    @apply flex flex-col gap-2 p-3;
}

.date_picker__divider {
    @apply h-[1px] border-b border-gray-400;
}

.date_picker__network_accordion {
    @apply flex gap-2 items-center;
}

.date_picker__network_accordion_icon_wrapper {
    @apply p-1.5 bg-green-light rounded-full;
}

.date_picker__network_accordion_icon {
    @apply w-5 h-5;
}
</style>
