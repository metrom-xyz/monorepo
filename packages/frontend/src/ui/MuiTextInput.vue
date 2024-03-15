<script setup lang="ts">
import { useAttrs, type Component } from "vue";
import MuiBaseInputWrapper from "./commons/MuiBaseInputWrapper.vue";
import type { BaseInputWrapperProps } from "./commons/types";

defineSlots<{
    action: Component;
}>();
const props = defineProps<BaseInputWrapperProps>();
const model = defineModel();

const attrs = useAttrs();
const optionalModel = props.noModel ? undefined : model;
</script>
<template>
    <MuiBaseInputWrapper
        class="mui_text_input__wrapper"
        v-bind="$props"
        :id="attrs.id || $.uid.toString()"
        :action="$slots.action"
    >
        <input
            v-model="optionalModel"
            :id="(attrs.id as string) || $.uid.toString()"
            type="text"
            :disabled="(attrs.disabled as boolean) || $props.loading"
            v-bind="attrs"
            class="mui_text_input__root"
        />
    </MuiBaseInputWrapper>
</template>
<style>
.mui_text_input__root {
    @apply hover:cursor-text;
}
</style>
