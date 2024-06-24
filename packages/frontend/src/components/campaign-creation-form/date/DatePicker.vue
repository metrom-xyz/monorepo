<script setup lang="ts">
import type { DatePickerTypes } from "./types";
import { computed, watch, watchEffect } from "vue";
import {
    MetDateRangeInput,
    MetTypography,
    MetWarningMessage,
} from "@metrom-xyz/ui";
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

const minDate = ref<Dayjs | undefined>(dayjs());
const rangeError = ref("");

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
            if (campaignDuration.value < durationLimits.value.min)
                rangeError.value =
                    "campaign.range.picker.error.minimumDuration";
            else if (campaignDuration.value > durationLimits.value.max)
                rangeError.value =
                    "campaign.range.picker.error.maximumDuration";
            else if (
                dayjs(props.state.range?.from).isBefore(
                    minDate.value,
                    "seconds",
                )
            )
                rangeError.value = "campaign.range.picker.error.pastStartDate";
            else if (
                dayjs(props.state.range?.to).isBefore(minDate.value, "seconds")
            )
                rangeError.value = "campaign.range.picker.error.pastEndDate";
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
            :error="!!rangeError"
            :min="minDate"
            :loading="loadingMinMaxDuration"
            :messages="{
                startLabel: $t('campaign.range.picker.startLabel'),
                endLabel: $t('campaign.range.picker.endLabel'),
                startPlaceholder: $t('campaign.range.picker.startPlaceholder'),
                endPlaceholder: $t('campaign.range.picker.endPlaceholder'),
            }"
        />
        <MetWarningMessage v-if="rangeError" class="date_picker__warning">
            <MetTypography>
                {{ $t("campaign.range.picker.error.label") }}
            </MetTypography>
            <template v-if="durationLimits" #popover>
                <MetTypography>{{
                    $t(rangeError, {
                        minDuration: Math.floor(durationLimits.min / 60),
                        maxDuration: Math.floor(
                            durationLimits.max / 60 / 60 / 24,
                        ),
                    })
                }}</MetTypography>
            </template>
        </MetWarningMessage>
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
