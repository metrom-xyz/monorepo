<script setup lang="ts">
import { computed, ref, useAttrs } from "vue";
import MuiModal from "../modal/MuiModal.vue";
import MuiTextInput from "../MuiTextInput.vue";
import CalendarIcon from "@/icons/CalendarIcon.vue";
import type { DateRangeInputProps } from "./types";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import dayjs, { Dayjs } from "dayjs";
import type { BaseInputWrapperProps } from "../commons/types";
import MuiDateRangeInputPicker from "./range-picker/MuiDateRangeInputPicker.vue";
import MuiButton from "../button/MuiButton.vue";
import MuiTypography from "../typography/MuiTypography.vue";
import { watchEffect } from "vue";
import type { Range } from "@/types";

dayjs.extend(LocalizedFormat);

const props = defineProps<
    Pick<BaseInputWrapperProps, "loading" | "error"> & DateRangeInputProps
>();
const rangeModel = defineModel<Range>("range");

const attrs = useAttrs();

const open = ref(false);
const internalStartDate = ref<Dayjs | undefined>(rangeModel.value?.from);
const internalEndDate = ref<Dayjs | undefined>(rangeModel.value?.from);

const startDateText = computed(() =>
    rangeModel.value?.from
        ? dayjs(rangeModel.value.from).format("L HH:mm:ss")
        : undefined,
);

const endDateText = computed(() =>
    rangeModel.value?.to
        ? dayjs(rangeModel.value.to).format("L HH:mm:ss")
        : undefined,
);

const validRange = computed(
    () =>
        internalStartDate.value &&
        internalEndDate.value &&
        internalEndDate.value.isAfter(internalStartDate.value),
);

function handlePickerOpenOnClick() {
    if (!open.value && (attrs.disabled || props.loading)) return;
    open.value = true;
}

function handlePickerOnDismiss() {
    if (!rangeModel.value?.from || !rangeModel.value.to) {
        internalStartDate.value = undefined;
        internalEndDate.value = undefined;
    }
    open.value = false;
}

function handlePickerOnApply() {
    rangeModel.value = {
        from: internalStartDate.value,
        to: internalEndDate.value,
    };
    open.value = false;
}

watchEffect(() => {
    if (!open.value) {
        internalStartDate.value = undefined;
        internalEndDate.value = undefined;
    } else {
        internalStartDate.value = rangeModel.value?.from;
        internalEndDate.value = rangeModel.value?.to;
    }
});
</script>
<template>
    <div class="mui_date_range_input__root">
        <MuiModal :open="open" :onDismiss="handlePickerOnDismiss">
            <div class="mui_date_range_input__text__inputs">
                <MuiTextInput
                    v-model="startDateText"
                    :loading="$props.loading"
                    :placeholder="$props.messages.startPlaceholder"
                    :error="$props.error"
                    readonly
                    :icon="CalendarIcon"
                    @click="handlePickerOpenOnClick"
                />
                <div class="mui_date_range_input__divider"></div>
                <MuiTextInput
                    v-model="endDateText"
                    :loading="$props.loading"
                    :placeholder="$props.messages.endPlaceholder"
                    :error="$props.error"
                    readonly
                    :icon="CalendarIcon"
                    @click="handlePickerOpenOnClick"
                />
            </div>
            <template #modal>
                <MuiDateRangeInputPicker
                    :onDismiss="handlePickerOnDismiss"
                    :messages="{
                        startLabel: $props.messages.startLabel,
                        endLabel: $props.messages.endLabel,
                    }"
                    v-model:startDate="internalStartDate"
                    v-model:endDate="internalEndDate"
                    :min="$props.min"
                    :max="$props.max"
                />
                <div class="mui_date_range_input__modal__footer">
                    <div class="mui_date_range_input__modal__footer__content">
                        <MuiButton
                            sm
                            class="mui_date_range_input__modal__apply__button"
                            :disabled="!validRange"
                            @click="handlePickerOnApply"
                        >
                            <MuiTypography medium>
                                {{ $t("campaign.range.picker.apply") }}
                            </MuiTypography>
                        </MuiButton>
                    </div>
                </div>
            </template>
        </MuiModal>
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
