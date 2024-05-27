<script setup lang="ts">
import { ref } from "vue";
import type { DateRangeInputProps } from "./types";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import dayjs, { Dayjs } from "dayjs";
import type { BaseInputWrapperProps } from "../commons/types";
import type { Range } from "@/types";
import MuiDateInput from "../date-input/MuiDateInput.vue";
import { watchEffect } from "vue";

dayjs.extend(LocalizedFormat);

defineProps<
    Pick<BaseInputWrapperProps, "loading" | "error"> & DateRangeInputProps
>();
const rangeModel = defineModel<Range>("range");

const internalStartDate = ref<Dayjs | undefined>(rangeModel.value?.from);
const internalEndDate = ref<Dayjs | undefined>(rangeModel.value?.from);

watchEffect(() => {
    rangeModel.value = {
        from: internalStartDate.value,
        to: internalEndDate.value,
    };
});
</script>
<template>
    <div class="mui_date_range_input__root">
        <div class="mui_date_range_input__text__inputs">
            <MuiDateInput
                time
                v-model="internalStartDate"
                :error="$props.error"
                :loading="$props.loading"
                :min="$props.min"
                :max="$props.max"
                :messages="{
                    label: '',
                    placeholder: $props.messages.startPlaceholder,
                }"
            />
            <div class="mui_date_range_input__divider"></div>
            <MuiDateInput
                time
                v-model="internalEndDate"
                :error="$props.error"
                :loading="$props.loading"
                :min="internalStartDate || $props.min"
                :max="$props.max"
                :lookupDate="internalStartDate"
                :messages="{
                    label: '',
                    placeholder: $props.messages.endPlaceholder,
                }"
            />
        </div>
    </div>
</template>
<style>
.mui_date_range_input__modal__footer {
    @apply border-t border border-gray-400 bg-white rounded-b-[30px] border-x-2 border-b-2 border-b-green border-x-green;
}

.mui_date_range_input__modal__footer__content {
    @apply flex justify-center px-8 py-5;
}

.mui_date_range_input__modal__apply__button {
    @apply w-1/2;
}

.mui_date_range_input__text__inputs {
    @apply flex flex-col gap-2;
}

.mui_date_range_input__divider {
    @apply h-[1px] border-b border-gray-400;
}
</style>
