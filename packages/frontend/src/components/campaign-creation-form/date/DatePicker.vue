<script setup lang="ts">
import type { DatePickerTypes } from "./types";
import { computed, watch, watchEffect } from "vue";
import MuiDateRangeInput from "@/ui/date-range-input/MuiDateRangeInput.vue";
import { ref } from "vue";
import dayjs, { Dayjs } from "dayjs";
import { onMounted } from "vue";
import { onUnmounted } from "vue";
import { useCampaignMinMaxDuration } from "@/composables/useCampaignMinMaxDuration";

const props = defineProps<DatePickerTypes>();
const emits = defineEmits<{
    complete: [];
    error: [boolean];
}>();

const minDate = ref<Dayjs | undefined>();
const rangeError = ref(false);

const { duration: durationLimits, loading: loadingMinMaxDuration } =
    useCampaignMinMaxDuration();

const campaignDuration = computed(() =>
    dayjs(props.state.range?.to).diff(props.state.range?.from, "seconds"),
);

watch(
    () => [
        props.state.range?.from,
        props.state.range?.to,
        minDate.value,
        durationLimits.value,
    ],
    () => {
        if (
            durationLimits.value?.max !== undefined &&
            durationLimits.value?.min !== undefined &&
            props.state.range &&
            props.state.range.from &&
            props.state.range.to
        ) {
            rangeError.value =
                campaignDuration.value < durationLimits.value.min ||
                campaignDuration.value > durationLimits.value.max ||
                dayjs(props.state.range?.from).isBefore(dayjs(), "seconds") ||
                dayjs(props.state.range?.to).isBefore(dayjs(), "seconds");
        }
    },
    { immediate: false },
);

watchEffect(() => {
    emits("error", props.completed && rangeError.value);

    if (props.completed || !props.state.range?.from || !props.state.range.to)
        return;
    emits("complete");
});

let interval: any;
onMounted(() => {
    interval = setInterval(() => {
        minDate.value = dayjs();
    }, 1000);
});
onUnmounted(() => {
    clearInterval(interval);
});
</script>
<template>
    <div class="date_picker__root">
        <MuiDateRangeInput
            v-model:range="$props.state.range"
            :error="rangeError"
            :min="minDate"
            :loading="loadingMinMaxDuration"
            :messages="{
                startLabel: $t('campaign.range.picker.startLabel'),
                endLabel: $t('campaign.range.picker.endLabel'),
                startPlaceholder: $t('campaign.range.picker.startPlaceholder'),
                endPlaceholder: $t('campaign.range.picker.endPlaceholder'),
            }"
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
