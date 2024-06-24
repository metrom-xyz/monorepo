<script setup lang="ts">
import dayjs, { Dayjs } from "dayjs";
import { ref, watchEffect } from "vue";
import {
    getCalendarCells,
    type CalendarCell,
    isCalendarCellDisabled,
    isCalendarCellSelected,
} from "../../utils/date";
import type { DateInputProps } from "./types";
import MetTypography from "../typography/MetTypography.vue";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon.vue";

const props = defineProps<Omit<DateInputProps, "messages">>();

const dateModel = defineModel<Dayjs>();

const lookupDate = ref<Dayjs>(
    dateModel.value ? dayjs(dateModel.value) : dayjs(props.lookupDate),
);
const cells = ref<CalendarCell[]>([]);

watchEffect(() => {
    cells.value = getCalendarCells(lookupDate.value);
});

const handleCellOnClick = (event: MouseEvent) => {
    const index = (event.target as HTMLLIElement).dataset.index;
    if (index !== undefined) {
        const parsedIndex = parseInt(index);
        if (parsedIndex >= 0) dateModel.value = cells.value[parsedIndex].value;
    }
};
</script>
<template>
    <div class="met_date_picker__root">
        <div class="met_date_picker__header">
            <ArrowLeftIcon
                class="met_date_picker__icon"
                @click="lookupDate = lookupDate.subtract(1, 'month')"
            />
            <MetTypography uppercase class="flex-1 text-center select-none">
                {{ lookupDate.format("MMMM YYYY") }}
            </MetTypography>
            <ArrowLeftIcon
                class="met_date_picker__icon rotate-180"
                @click="lookupDate = lookupDate.add(1, 'month')"
            />
        </div>
        <div class="met_date_picker__week__days">
            <MetTypography
                v-for="cell in cells.slice(0, 7)"
                :key="cell.text"
                medium
                sm
                class="met_date_picker__week__day"
                :class="{
                    met_date_picker__week__day__holiday:
                        cell.value.day() === 0 || cell.value.day() === 6,
                }"
            >
                {{ cell.value.format("dd") }}
            </MetTypography>
        </div>
        <div class="met_date_picker__cells">
            <MetTypography
                v-for="(cell, index) in cells"
                :key="index"
                :data-index="index"
                @click="
                    !isCalendarCellDisabled(
                        cell,
                        lookupDate,
                        props.min,
                        props.max,
                    ) && handleCellOnClick($event)
                "
                class="met_date_picker__cell"
                :class="{
                    met_date_picker__cell__selected: isCalendarCellSelected(
                        cell,
                        dateModel,
                        props.min,
                        props.max,
                    ),
                    met_date_picker__cell__disabled: isCalendarCellDisabled(
                        cell,
                        lookupDate,
                        props.min,
                        props.max,
                    ),
                }"
            >
                {{ cell.text }}
            </MetTypography>
        </div>
    </div>
</template>
<style>
.met_date_picker__root {
    @apply flex flex-col gap-6 justify-between p-4;
}

.met_date_picker__header {
    @apply flex items-center;
}

.met_date_picker__icon {
    @apply cursor-pointer text-black;
}

.met_date_picker__week__days {
    @apply grid grid-cols-7;
}

.met_date_picker__week__day {
    @apply w-6 h-6 flex justify-center items-center text-gray-600 select-none;
}

.met_date_picker__week__day__holiday {
    @apply text-red-light;
}

.met_date_picker__cells {
    @apply grid grid-cols-7 grid-rows-4 gap-1;
}

.met_date_picker__cell {
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
.met_date_picker__cell__selected {
    @apply bg-green text-black;
}

.met_date_picker__cell__disabled {
    @apply text-gray-400 hover:bg-white cursor-not-allowed;
}
</style>
