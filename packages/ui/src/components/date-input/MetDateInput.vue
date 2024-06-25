<script setup lang="ts">
import { ref } from "vue";
import MetTextInput from "../MetTextInput.vue";
import MetPopover from "../popover/MetPopover.vue";
import type { Dayjs } from "dayjs";
import { computed } from "vue";
import dayjs from "dayjs";
import type { DateInputProps } from "./types";
import type { BaseInputWrapperProps } from "../commons/types";
import CalendarIcon from "../../icons/CalendarIcon.vue";
import { onMounted } from "vue";
import { onUnmounted } from "vue";
import MetDatePicker from "./MetDatePicker.vue";
import MetDateTimeWheel from "./MetDateTimeWheel.vue";

defineProps<
    Pick<BaseInputWrapperProps, "loading" | "error"> & DateInputProps
>();
const dateModel = defineModel<Dayjs>();

const pickerRef = ref<HTMLElement | null>(null);
const open = ref(false);

const dateText = computed(() =>
    dateModel.value
        ? dayjs(dateModel.value).format("DD MMM YYYY HH:mm")
        : undefined,
);

function handlePickerOnOpen() {
    open.value = true;
}

function handlePickerCloseOnMouseDown(event: MouseEvent) {
    if (
        pickerRef.value &&
        event.button === 0 &&
        !pickerRef.value.contains(event.target as HTMLElement)
    )
        open.value = false;
}

function handleTimeOnChange(date: Dayjs) {
    dateModel.value = date.second(0).millisecond(0);
}

onMounted(() => {
    document.addEventListener("mousedown", handlePickerCloseOnMouseDown);
});

onUnmounted(() => {
    document.removeEventListener("mousedown", handlePickerCloseOnMouseDown);
});
</script>
<template>
    <div class="met_date_input__root">
        <MetPopover :open="open" :placement="'bottom'">
            <MetTextInput
                v-model="dateText"
                :loading="$props.loading"
                :label="$props.messages.label"
                :placeholder="$props.messages.placeholder"
                :error="$props.error"
                readonly
                :icon="CalendarIcon"
                @click="handlePickerOnOpen"
            />
            <template #popover>
                <div ref="pickerRef" class="met_date_input__picker__container">
                    <MetDatePicker
                        v-model="dateModel"
                        :min="$props.min"
                        :max="$props.max"
                        :lookupDate="$props.lookupDate"
                    />
                    <MetDateTimeWheel
                        v-if="$props.time"
                        :value="dateModel"
                        :min="$props.min"
                        :max="$props.max"
                        @timeChange="handleTimeOnChange"
                    />
                </div>
            </template>
        </MetPopover>
    </div>
</template>
<style>
.met_date_input__root {
    @apply w-full;
}

.met_date_input__picker__container {
    @apply flex w-fit;
}
</style>
