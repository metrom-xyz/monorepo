<script setup lang="ts">
import {
    HOURS,
    MINUTES_SECONDS,
    getUpdatedMinMaxValue,
    isCalendarTimeCellDisabled,
    isCalendarTimeCellSelected,
    rectifyDate,
    resolvedValue,
} from "@/utils/date";
import type { DateRangeInputTimeWheelProps } from "./types";
import dayjs, { Dayjs, type UnitType } from "dayjs";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { ref } from "vue";
import { watchEffect } from "vue";
import { onMounted } from "vue";

const props = defineProps<DateRangeInputTimeWheelProps>();
const emits = defineEmits<{
    timeChange: [Dayjs];
}>();

const maxDate = ref(props.max);
const minDate = ref(props.min);
const hoursWheelCells = ref<Record<string, unknown>>({});
const minutesWheelCells = ref<Record<string, unknown>>({});

function handleTimeOnChange(event: MouseEvent) {
    const data = (event.target as HTMLLIElement).dataset.data;
    if (data !== undefined) {
        const [unit, newValue] = data.split("-");
        const parsedNewValue = parseInt(newValue);
        if (isNaN(parsedNewValue)) return;
        const initialDate = resolvedValue(
            props.value,
            minDate.value,
            maxDate.value,
        );
        const pickedDate = dayjs(initialDate).set(
            unit as UnitType,
            parsedNewValue,
        );
        emits(
            "timeChange",
            dayjs(rectifyDate(pickedDate, minDate.value, maxDate.value)),
        );
    }
}

watchEffect(() => {
    const updatedMin = getUpdatedMinMaxValue(minDate.value, props.min);
    const updatedMax = getUpdatedMinMaxValue(maxDate.value, props.max);

    minDate.value = updatedMin;
    maxDate.value = updatedMax;

    if (
        updatedMin &&
        updatedMax &&
        dayjs(updatedMin).isAfter(dayjs(updatedMax))
    ) {
        minDate.value = updatedMax;
        console.warn("inconsistent min and max values", {
            min: updatedMin?.toISOString(),
            max: updatedMax?.toISOString(),
        });
    }
});

// in case a value change happened, check if we're still
// alright with validation and rectify if needed
watchEffect(() => {
    if (!props.value) return;
    const originalValue = dayjs(props.value);
    const rectifiedValue = rectifyDate(
        dayjs(props.value),
        minDate.value,
        maxDate.value,
    );
    if (!originalValue.isSame(rectifiedValue, "minutes"))
        emits("timeChange", dayjs(rectifiedValue));
});

onMounted(() => {
    (
        hoursWheelCells.value[dayjs(props.value).format("HH")] as {
            element: Element;
        }
    ).element.scrollIntoView();
    (
        minutesWheelCells.value[dayjs(props.value).format("mm")] as {
            element: Element;
        }
    ).element.scrollIntoView();
});
</script>
<template>
    <div class="mui_time_wheel__wheels">
        <div class="mui_time_wheel__wheel">
            <MuiTypography
                v-for="hour in HOURS"
                :ref="(el) => (hoursWheelCells[hour] = el)"
                :key="hour"
                :data-data="`hour-${hour}`"
                @click="handleTimeOnChange($event)"
                class="mui_time_wheel__cell"
                :class="{
                    mui_time_wheel__cell__selected: isCalendarTimeCellSelected(
                        'HH',
                        hour,
                        $props.value,
                    ),
                    mui_time_wheel__cell__disabled: isCalendarTimeCellDisabled(
                        'hour',
                        hour,
                        $props.value,
                        minDate,
                        maxDate,
                    ),
                }"
            >
                {{ hour }}
            </MuiTypography>
        </div>
        <div class="mui_time_wheel__wheel">
            <MuiTypography
                v-for="minute in MINUTES_SECONDS"
                :ref="(el) => (minutesWheelCells[minute] = el)"
                :key="minute"
                :data-data="`minute-${minute}`"
                @click="handleTimeOnChange($event)"
                class="mui_time_wheel__cell"
                :class="{
                    mui_time_wheel__cell__selected: isCalendarTimeCellSelected(
                        'mm',
                        minute,
                        $props.value,
                    ),
                    mui_time_wheel__cell__disabled: isCalendarTimeCellDisabled(
                        'minute',
                        minute,
                        $props.value,
                        minDate,
                        maxDate,
                    ),
                }"
            >
                {{ minute }}
            </MuiTypography>
        </div>
    </div>
</template>
<style>
.mui_time_wheel__wheels {
    @apply flex h-full;
}

.mui_time_wheel__wheel {
    @apply h-72 w-full py-2 px-1 overflow-y-auto;
}

.mui_time_wheel__cell {
    @apply flex items-center justify-center h-10 w-10 p-1 cursor-pointer bg-white text-black hover:bg-gray-300 rounded-full;
}

.mui_time_wheel__cell__disabled {
    @apply text-gray-400 hover:bg-white cursor-not-allowed pointer-events-none;
}

.mui_time_wheel__cell__selected {
    @apply bg-green text-black;
}
</style>
