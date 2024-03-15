<script setup lang="ts">
import { watchEffect } from "vue";
import MuiBaseInputWrapper from "./commons/MuiBaseInputWrapper.vue";
import type { BaseInputWrapperProps } from "./commons/types";
import { useIMask } from "vue-imask";

defineProps<BaseInputWrapperProps>();
const model = defineModel<number>();

const { el, masked, typed } = useIMask({
    mask: Number,
    thousandsSeparator: ",",
    radix: ".",
    mapToRadix: ["."],
});

watchEffect(() => {
    model.value = masked ? Number(typed) : undefined;
});
</script>
<template>
    <MuiBaseInputWrapper
        class="mui_number_input__wrapper"
        v-bind="$props"
        :id="$attrs.id || $.uid.toString()"
    >
        <input
            :id="($attrs.id as string) || $.uid.toString()"
            :disabled="($attrs.disabled as boolean) || $props.loading"
            ref="el"
            v-bind="$attrs"
            class="mui_number_input__root"
        />
    </MuiBaseInputWrapper>
</template>
<style>
.mui_number_input__root {
    @apply hover:cursor-text;
}
</style>
