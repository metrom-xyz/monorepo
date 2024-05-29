<script setup lang="ts">
import { ref, useAttrs } from "vue";
import { type SwitchProps } from "./types";
import MuiTypography from "../typography/MuiTypography.vue";
import MuiPopover from "../popover/MuiPopover.vue";
import InfoIcon from "@/icons/InfoIcon.vue";

const props = defineProps<SwitchProps>();
const model = defineModel<boolean>();

const attrs = useAttrs();

const popover = ref(false);
</script>
<template>
    <div class="mui_switch__root">
        <div
            class="mui_switch__track"
            :class="{ mui_switch__track__checked: model }"
        >
            <div
                class="mui_switch__thumb"
                :class="{ mui_switch__thumb__checked: model }"
            ></div>
            <input
                type="checkbox"
                class="mui_switch__input"
                :id="(attrs.id as string) || $.uid.toString()"
                v-model="model"
            />
        </div>
        <label
            class="mui_switch__label"
            :for="(attrs.id as string) || $.uid.toString()"
        >
            <MuiTypography
                v-bind="{
                    xs: props.xs,
                    sm: props.sm,
                    lg: props.lg,
                    xl: props.xl,
                }"
            >
                {{ props.label }}
            </MuiTypography>
            <MuiPopover v-if="!!props.info" :open="popover">
                <InfoIcon
                    class="mui_switch__info__icon"
                    @mouseenter="popover = true"
                    @mouseleave="popover = false"
                />
                <template #popover>
                    <MuiTypography class="mui_switch__info__popover">
                        {{ props.info }}
                    </MuiTypography>
                </template>
            </MuiPopover>
        </label>
    </div>
</template>
<style>
.mui_switch__root {
    @apply flex items-center;
}

.mui_switch__track {
    @apply relative 
        w-10
        h-5
        cursor-pointer
        rounded-full
        bg-gray-300;
}

.mui_switch__track__checked {
    @apply bg-green;
}

.mui_switch__thumb {
    @apply absolute
        top-1
        left-1
        h-3
        w-3
        bg-black
        rounded-full;
}

.mui_switch__thumb__checked {
    @apply left-auto right-1;
}

.mui_switch__input {
    @apply cursor-pointer
        absolute
        top-0
        left-0
        w-full
        h-full
        opacity-0;
}

.mui_switch__label {
    @apply flex
        items-center
        gap-1.5
        ml-2
        w-fit;
}

.mui_switch__info__icon {
    @apply w-4 h-4 text-black;
}

.mui_switch__info__popover {
    @apply px-3 py-2;
}
</style>
