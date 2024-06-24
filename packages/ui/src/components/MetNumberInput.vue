<script setup lang="ts">
import { watchEffect } from "vue";
import MetBaseInputWrapper from "./commons/MetBaseInputWrapper.vue";
import type { BaseInputWrapperProps } from "./commons/types";
import { useIMask } from "vue-imask";

defineProps<BaseInputWrapperProps>();
const model = defineModel<number | string>();

const { el, masked, typed } = useIMask({
    mask: Number,
    scale: 3,
    thousandsSeparator: ",",
    radix: ".",
    mapToRadix: ["."],
});

watchEffect(() => {
    model.value = masked.value ? Number(typed.value) : undefined;
});
</script>
<template>
    <MetBaseInputWrapper
        class="met_number_input__wrapper"
        v-bind="$props"
        :id="$attrs.id || $.uid.toString()"
    >
        <input
            :id="($attrs.id as string) || $.uid.toString()"
            :disabled="($attrs.disabled as boolean) || $props.loading"
            ref="el"
            v-bind="$attrs"
            class="met_number_input__root"
        />
    </MetBaseInputWrapper>
</template>
<style>
.met_number_input__root {
    @apply hover:cursor-text;
}
</style>
