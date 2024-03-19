<script setup lang="ts">
import { type Component } from "vue";

defineSlots<{
    default: Component[];
}>();
</script>
<template>
    <div class="mui_stepper__root">
        <slot></slot>
    </div>
</template>
<style>
.mui_stepper__root {
    @apply w-full flex flex-col gap-5;
}
</style>
