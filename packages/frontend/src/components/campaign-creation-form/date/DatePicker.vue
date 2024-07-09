<script setup lang="ts">
import type { DatePickerTypes } from "./types";
import { computed, watch, watchEffect } from "vue";
import { MetDateRangeInput } from "@metrom-xyz/ui";
import { ref } from "vue";
import dayjs, { Dayjs } from "dayjs";
import { onMounted } from "vue";
import { onUnmounted } from "vue";
import { useCampaignMinMaxDuration } from "@/composables/useCampaignMinMaxDuration";
import { useI18n } from "vue-i18n";

const props = defineProps<DatePickerTypes>();
const emits = defineEmits<{
    complete: [];
    error: [boolean];
}>();

const { t } = useI18n();

const minDate = ref<Dayjs | undefined>(dayjs());
const rangeError = ref("");

const { duration: durationLimits, loading: loadingMinMaxDuration } =
    useCampaignMinMaxDuration();

const campaignDuration = computed(() =>
    dayjs(props.state.range?.to).diff(props.state.range?.from, "seconds"),
);

const limits = computed(() => {
    if (!durationLimits.value) return null;

    return {
        min: {
            raw: durationLimits.value.min,
            parsed: Math.floor(durationLimits.value.min / 60),
        },
        max: {
            raw: durationLimits.value.max,
            parsed: Math.floor(durationLimits.value.max / 60 / 60 / 24),
        },
    };
});

watch(
    () => [
        props.state.range?.from,
        props.state.range?.to,
        minDate.value,
        limits.value,
    ],
    () => {
        if (
            !!limits.value &&
            props.state.range &&
            props.state.range.from &&
            props.state.range.to
        ) {
            if (campaignDuration.value < limits.value.min.raw)
                rangeError.value = t(
                    "campaign.range.picker.error.minimumDuration",
                    {
                        minDuration: limits.value.min.parsed,
                    },
                );
            else if (campaignDuration.value > limits.value.max.raw)
                rangeError.value = t(
                    "campaign.range.picker.error.maximumDuration",
                    {
                        maxDuration: limits.value.max.parsed,
                    },
                );
            else if (
                dayjs(props.state.range?.from).isBefore(
                    minDate.value,
                    "seconds",
                )
            )
                rangeError.value = t(
                    "campaign.range.picker.error.pastStartDate",
                );
            else if (
                dayjs(props.state.range?.to).isBefore(minDate.value, "seconds")
            )
                rangeError.value = t("campaign.range.picker.error.pastEndDate");
            else rangeError.value = "";
        }
    },
    { immediate: false },
);

watchEffect(() => {
    emits("error", props.completed && !!rangeError.value);

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
        <MetDateRangeInput
            v-model:range="$props.state.range"
            :error="rangeError || false"
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

.date_picker__warning {
    @apply self-end;
}
</style>
