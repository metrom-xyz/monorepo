<script setup lang="ts">
import { Dayjs } from "dayjs";
import { ref, watchEffect } from "vue";
import MuiTypography from "../../typography/MuiTypography.vue";
import type { DateRangeInputCalendarProps } from "./types";
import {
    getCalendarCells,
    type CalendarCell,
    isCalendarCellDisabled,
    isCalendarCellSelected,
} from "../../../utils/date";
import ArrowLeftIcon from "@/icons/ArrowLeftIcon.vue";

const props = defineProps<DateRangeInputCalendarProps>();
const emits = defineEmits<{
    lookupPreviousMonth: [];
    lookupNextMonth: [];
    dateChange: [Dayjs];
}>();

const cells = ref<CalendarCell[]>([]);

watchEffect(() => {
    cells.value = getCalendarCells(props.lookupDate);
});

function handleCellOnClick(event: MouseEvent) {
    if (!event.target) {
        return;
    }
    const index = (event.target as HTMLLIElement).dataset.index;
    if (index !== undefined) {
        const parsedIndex = parseInt(index);
        if (parsedIndex >= 0)
            emits("dateChange", cells.value[parsedIndex].value);
    }
}
</script>
<template>
    <div class="mui_date_range_input_calendar__root">
        <div class="mui_date_range_input_calendar__header">
            <ArrowLeftIcon
                class="mui_date_range_input_calendar__icon"
                :class="{
                    mui_date_range_input_calendar__icon_hidden:
                        !$props.leftPicker,
                }"
                @click="emits('lookupPreviousMonth')"
            />
            <MuiTypography
                uppercase
                class="mui_date_range_input_calendar__month"
            >
                {{ $props.lookupDate.format("MMMM YYYY") }}
            </MuiTypography>
            <ArrowLeftIcon
                class="mui_date_range_input_calendar__icon rotate-180"
                :class="{
                    mui_date_range_input_calendar__icon_hidden:
                        $props.leftPicker,
                }"
                @click="emits('lookupNextMonth')"
            />
        </div>
        <div class="mui_date_range_input_calendar__week__days">
            <MuiTypography
                v-for="cell in cells.slice(0, 7)"
                :key="cell.text"
                medium
                sm
                class="mui_date_range_input_calendar__week__day"
                :class="{
                    mui_date_range_input_calendar__week__day__holiday:
                        cell.value.day() === 0 || cell.value.day() === 6,
                }"
            >
                {{ cell.value.format("dd") }}
            </MuiTypography>
        </div>
        <div class="mui_date_range_input_calendar__cells">
            <div
                class="mui_date_range_input_calendar__cell__wrapper"
                v-for="(cell, index) in cells"
                :key="index"
                :class="{
                    mui_date_range_input_calendar__cell__wrapper__in__range:
                        !!$props.dateInRange && $props.dateInRange(cell.value),
                    mui_date_range_input_calendar__cell__wrapper__selected__from:
                        cell.value.isSame($props.from),
                    mui_date_range_input_calendar__cell__wrapper__selected__to:
                        cell.value.isSame($props.to),
                }"
            >
                <MuiTypography
                    class="mui_date_range_input_calendar__cell"
                    :data-index="index"
                    @click="
                        !isCalendarCellDisabled(
                            cell,
                            $props.lookupDate,
                            $props.min,
                            $props.max,
                        ) && handleCellOnClick($event)
                    "
                    :class="{
                        mui_date_range_input_calendar__cell__selected:
                            isCalendarCellSelected(
                                cell,
                                $props.from,
                                $props.min,
                                $props.max,
                            ) ||
                            isCalendarCellSelected(
                                cell,
                                $props.to,
                                $props.min,
                                $props.max,
                            ),
                        mui_date_range_input_calendar__cell__disabled:
                            isCalendarCellDisabled(
                                cell,
                                $props.lookupDate,
                                $props.min,
                                $props.max,
                            ),
                        mui_date_range_input_calendar__cell__in__range:
                            !!$props.dateInRange &&
                            $props.dateInRange(cell.value),
                    }"
                >
                    {{ cell.text }}
                </MuiTypography>
            </div>
        </div>
    </div>
</template>
<style>
.mui_date_range_input_calendar__root {
    @apply flex flex-col gap-6 justify-between;
}

.mui_date_range_input_calendar__header {
    @apply flex items-center;
}

.mui_date_range_input_calendar__icon {
    @apply cursor-pointer text-black dark:text-white;
}

.mui_date_range_input_calendar__icon_hidden {
    @apply invisible;
}

.mui_date_range_input_calendar__month {
    @apply flex-1 text-center select-none;
}

.mui_date_range_input_calendar__week__days {
    @apply grid grid-cols-7;
}

.mui_date_range_input_calendar__week__day {
    @apply w-10 h-10 -mb-3 flex justify-center items-center text-gray-600 select-none;
}

/* TODO: add style */
.mui_date_range_input_calendar__week__day__holiday {
}

.mui_date_range_input_calendar__cells {
    @apply grid grid-cols-7 grid-rows-4;
}

.mui_date_range_input_calendar__cell {
    @apply w-10
        h-10
        p-1
        flex
        justify-center
        items-center
        rounded-full
        bg-white
        text-black
        hover:bg-gray-300
        cursor-pointer
        select-none;
}

.mui_date_range_input_calendar__cell__wrapper__in__range {
    @apply bg-green-light;
}

.mui_date_range_input_calendar__cell__wrapper__selected__from {
    @apply rounded-l-full;
}

.mui_date_range_input_calendar__cell__wrapper__selected__to {
    @apply rounded-r-full;
}

.mui_date_range_input_calendar__cell__in__range {
    @apply bg-green-light;
}

.mui_date_range_input_calendar__cell__selected {
    @apply bg-green text-black;
}

.mui_date_range_input_calendar__cell__disabled {
    @apply text-gray-400 hover:bg-white cursor-not-allowed;
}
</style>
