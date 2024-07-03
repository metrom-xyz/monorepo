<script setup lang="ts">
import { watchEffect } from "vue";
import MetBaseInputWrapper from "../commons/MetBaseInputWrapper.vue";
import type { BaseInputWrapperProps } from "../commons/types";
import { useIMask } from "vue-imask";
import type { NumberInputProps, NumberMaskValue } from "./types";

const props = withDefaults(
    defineProps<BaseInputWrapperProps & NumberInputProps>(),
    { scale: 10 },
);
const model = defineModel<NumberMaskValue>();

const { el, masked, typed, unmasked, mask } = useIMask({
    mask: Number,
    scale: props.scale,
    thousandsSeparator: ",",
    radix: ".",
    mapToRadix: ["."],
});

watchEffect(() => {
    model.value = {
        floatValue: typed.value,
        formattedValue: masked.value,
        value: unmasked.value,
    };
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
