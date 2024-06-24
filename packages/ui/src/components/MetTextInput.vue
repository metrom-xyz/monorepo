<script setup lang="ts">
import { useAttrs, type Component } from "vue";
import MetBaseInputWrapper from "./commons/MetBaseInputWrapper.vue";
import type { BaseInputWrapperProps } from "./commons/types";
import { ref } from "vue";

defineSlots<{
    action: Component;
    icon: Component;
}>();
const props = defineProps<BaseInputWrapperProps>();
const model = defineModel();

const attrs = useAttrs();

const inputRef = ref<HTMLInputElement | null>(null);

const optionalModel = props.noModel ? undefined : model;

defineExpose({ input: inputRef });
</script>
<template>
    <MetBaseInputWrapper v-bind="$props" :id="attrs.id || $.uid.toString()">
        <input
            ref="inputRef"
            v-model="optionalModel"
            :id="(attrs.id as string) || $.uid.toString()"
            type="text"
            :disabled="(attrs.disabled as boolean) || $props.loading"
            v-bind="attrs"
            class="met_text_input__root"
        />
        <template #icon>
            <slot name="icon"></slot>
        </template>
    </MetBaseInputWrapper>
</template>
<style>
.met_text_input__root {
    @apply hover:cursor-text;
}
</style>
