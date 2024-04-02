<script setup lang="ts">
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import MuiBaseInputWrapper from "./commons/MuiBaseInputWrapper.vue";
import type { BaseInputWrapperProps } from "./commons/types";
import dayjs, { Dayjs } from "dayjs";
import { watchEffect } from "vue";
import { ref } from "vue";
import CalendarIcon from "@/icons/CalendarIcon.vue";
import ClockIcon from "@/icons/ClockIcon.vue";

// TODO: find a better way to use the imask with the v-model

dayjs.extend(LocalizedFormat);

const props = defineProps<BaseInputWrapperProps & { time?: boolean }>();
const model = defineModel<Dayjs>();

const internalValue = ref();

watchEffect(() => {
    internalValue.value = model.value
        ? dayjs(model.value).format(props.time ? "HH:mm" : "L")
        : undefined;
});

// TODO: add time wheel picker
// TODO: fix time manual pick
function handleOnBlur(event: FocusEvent) {
    const value = (event.target as HTMLInputElement).value;
    if (!value) return;
    if (!dayjs(value).isValid()) {
        internalValue.value = dayjs(model.value).format(
            props.time ? "HH:mm" : "L",
        );
        return;
    }

    let date;
    if (props.time)
        date = dayjs(model.value)
            .hour(dayjs(value).hour())
            .minute(dayjs(value).minute());
    else
        date = dayjs(model.value)
            .date(dayjs(value).date())
            .month(dayjs(value).month())
            .year(dayjs(value).year());

    model.value = dayjs(date);
}
</script>
<template>
    <div
        class="mui_date_input_text__root"
        :class="{ mui_date_input_text__root_time: $props.time }"
    >
        <MuiBaseInputWrapper
            v-bind="$props"
            :id="$attrs.id || $.uid.toString()"
            :icon="$props.time ? ClockIcon : CalendarIcon"
            iconLeft
        >
            <input
                ref="el"
                :value="internalValue"
                :id="($attrs.id as string) || $.uid.toString()"
                :disabled="($attrs.disabled as boolean) || $props.loading"
                v-bind="$attrs"
                @input="
                    internalValue = ($event.target as HTMLInputElement).value
                "
                @blur="handleOnBlur"
            />
        </MuiBaseInputWrapper>
    </div>
</template>
<style>
.mui_date_input_text__root {
    @apply w-[170px];
}

.mui_date_input_text__root_time {
    @apply w-[120px];
}

.mui_date_input_text__root
    > .mui_base_input_wrapper__root
    > .mui_base_input_wrapper__container__left_icon
    > input {
    @apply pl-14;
}

.mui_date_input_text__root
    > .mui_base_input_wrapper__root
    > .mui_base_input_wrapper__container__left_icon
    > .mui_base_input_wrapper__icon__left {
    @apply left-1.5;
}
</style>
