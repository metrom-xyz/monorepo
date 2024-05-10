<script setup lang="ts">
import type { DatePickerTypes } from "./types";
import { computed, watch, watchEffect } from "vue";
import MuiDateRangeInput from "@/ui/date-range-input/MuiDateRangeInput.vue";
import { ref } from "vue";
import dayjs, { Dayjs } from "dayjs";
import { onMounted } from "vue";
import { onUnmounted } from "vue";
import { useCampaignMinMaxDuration } from "@/composables/useCampaignMinMaxDuration";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import MuiWarningMessage from "@/ui/MuiWarningMessage.vue";

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
                dayjs(props.state.range?.from).isBefore(
                    minDate.value,
                    "seconds",
                ) ||
                dayjs(props.state.range?.to).isBefore(minDate.value, "seconds");
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
        <MuiWarningMessage v-if="rangeError" class="date_picker__warning">
            <MuiTypography>
                {{ $t("campaign.range.picker.error.label") }}
            </MuiTypography>
            <template v-if="durationLimits" #popover>
                <MuiTypography>{{
                    $t("campaign.range.picker.error.description", {
                        minDuration: Math.floor(durationLimits.min / 60),
                        maxDuration: Math.floor(
                            durationLimits.max / 60 / 60 / 24,
                        ),
                    })
                }}</MuiTypography>
            </template>
        </MuiWarningMessage>
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
