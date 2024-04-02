<script setup lang="ts">
import {
    HOURS,
    MINUTES_SECONDS,
    isCalendarTimeCellDisabled,
    isCalendarTimeCellSelected,
} from "@/utils/date";
import type { DateRangeInputTimeWheelProps } from "./types";
import dayjs, { Dayjs, type UnitType } from "dayjs";
import MuiTypography from "@/ui/typography/MuiTypography.vue";

const props = defineProps<DateRangeInputTimeWheelProps>();
const emits = defineEmits<{
    timeChange: [Dayjs];
}>();

function handleTimeOnChange(event: MouseEvent) {
    const data = (event.target as HTMLLIElement).dataset.data;
    if (data !== undefined) {
        const [unit, newValue] = data.split("-");
        const parsedNewValue = parseInt(newValue);
        if (isNaN(parsedNewValue)) return;
        const pickedDate = dayjs(props.value).set(
            unit as UnitType,
            parsedNewValue,
        );
        emits("timeChange", pickedDate);
    }
}
</script>
<template>
    <div class="mui_time_wheel__wheels">
        <div class="mui_time_wheel__wheel">
            <MuiTypography
                v-for="hour in HOURS"
                :key="hour"
                sm
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
                    ),
                }"
            >
                {{ hour }}
            </MuiTypography>
        </div>
        <div class="mui_time_wheel__wheel">
            <MuiTypography
                v-for="minute in MINUTES_SECONDS"
                :key="minute"
                sm
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
    @apply h-52 w-full md:w-10 py-2 overflow-y-auto border-black border-r last:border-r-0 last:rounded-br-xxl first:rounded-bl-xxl;
}

.mui_time_wheel__cell {
    @apply flex items-center justify-center h-7 cursor-pointer bg-white text-black hover:bg-gray-300;
}

.mui_time_wheel__cell__selected {
    @apply bg-green text-black;
}

.mui_time_wheel__cell__disabled {
    @apply text-gray-400 hover:bg-white cursor-not-allowed;
}
</style>
