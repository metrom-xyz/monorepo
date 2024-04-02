<script setup lang="ts">
import XIcon from "@/icons/XIcon.vue";
import type { DateRangeInputPickerProps } from "./types";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import dayjs, { Dayjs } from "dayjs";
import MuiDateRangeInputCalendar from "../calendar/MuiDateRangeInputCalendar.vue";
import { ref } from "vue";
import { watch } from "vue";
import MuiDateTimeTextInput from "@/ui/MuiDateTimeTextInput.vue";
import { isDateInRange } from "@/utils/date";

defineProps<DateRangeInputPickerProps>();

const startDateModel = defineModel<Dayjs>("startDate");
const endDateModel = defineModel<Dayjs>("endDate");

const lastPickedDate = ref<Dayjs | undefined>(undefined);
const lookupDate = ref<Dayjs>(
    startDateModel.value ? dayjs(startDateModel.value) : dayjs(),
);

watch(lastPickedDate, (pickedDate) => {
    if (!pickedDate) return;

    if (!startDateModel.value) {
        startDateModel.value = pickedDate;
        return;
    }

    if (!endDateModel.value && pickedDate.isBefore(startDateModel.value)) {
        startDateModel.value = pickedDate;
        return;
    }

    if (!endDateModel.value) {
        endDateModel.value = pickedDate;
        return;
    }

    if (isDateInRange(pickedDate, startDateModel.value, endDateModel.value)) {
        startDateModel.value = pickedDate;
        return;
    }

    startDateModel.value = pickedDate;
    endDateModel.value = undefined;
});

function handleLastDatePickOnChange(value: Dayjs) {
    lastPickedDate.value = value;
}
</script>
<template>
    <div class="mui_date_range_input_picker__root">
        <XIcon
            @click="$props.onDismiss"
            class="mui_date_range_input_picker__close_icon"
        />
        <div class="mui_date_range_input_picker_inputs__container">
            <div class="mui_date_range_input_picker_input__wrapper">
                <MuiTypography>
                    {{ $props.messages.startLabel }}
                </MuiTypography>
                <div class="mui_date_range_input_picker_input__divider"></div>
                <div class="mui_date_range_input_picker_input__text__inputs">
                    <MuiDateTimeTextInput
                        v-model:modelValue="startDateModel"
                        readonly
                    />
                    <MuiDateTimeTextInput
                        v-model:modelValue="startDateModel"
                        time
                        readonly
                    />
                    <!-- TODO: add time wheel -->
                </div>
                <MuiDateRangeInputCalendar
                    leftPicker
                    :from="startDateModel"
                    :to="endDateModel"
                    :value="startDateModel"
                    :lookupDate="lookupDate"
                    :dateInRange="
                        (date) =>
                            isDateInRange(date, startDateModel, endDateModel)
                    "
                    @dateChange="handleLastDatePickOnChange"
                    @lookupPreviousMonth="
                        lookupDate = lookupDate.subtract(1, 'month')
                    "
                />
            </div>
            <div class="mui_date_range_input_picker_input__wrapper">
                <MuiTypography>
                    {{ $props.messages.endLabel }}
                </MuiTypography>
                <div class="mui_date_range_input_picker_input__divider"></div>
                <div class="mui_date_range_input_picker_input__text__inputs">
                    <MuiDateTimeTextInput
                        v-model:modelValue="endDateModel"
                        readonly
                    />
                    <MuiDateTimeTextInput
                        v-model:modelValue="endDateModel"
                        time
                        readonly
                    />
                </div>
                <MuiDateRangeInputCalendar
                    :from="startDateModel"
                    :to="endDateModel"
                    :value="endDateModel"
                    :lookupDate="lookupDate.add(1, 'month')"
                    :dateInRange="
                        (date) =>
                            isDateInRange(date, startDateModel, endDateModel)
                    "
                    @dateChange="handleLastDatePickOnChange"
                    @lookupNextMonth="lookupDate = lookupDate.add(1, 'month')"
                />
            </div>
        </div>
    </div>
</template>
<style>
.mui_date_range_input_picker__root {
    @apply flex flex-col px-8 py-5 bg-white rounded-t-[30px] border-2 border-b-0 border-green;
}

.mui_date_range_input_picker__close_icon {
    @apply self-end hover:cursor-pointer;
}

.mui_date_range_input_picker_inputs__container {
    @apply flex gap-16;
}

.mui_date_range_input_picker_input__wrapper {
    @apply w-full flex flex-col gap-3;
}

.mui_date_range_input_picker_input__divider {
    @apply h-[1px] border-b border-dashed border-gray-400;
}

.mui_date_range_input_picker_input__text__inputs {
    @apply flex gap-2 mb-3;
}
</style>
