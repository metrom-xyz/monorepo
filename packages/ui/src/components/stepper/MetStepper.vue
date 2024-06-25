<script setup lang="ts">
import { type Component } from "vue";

defineSlots<{
    default: Component[];
}>();
</script>
<template>
    <div class="met_stepper__root">
        <slot></slot>
    </div>
</template>
<style>
.met_stepper__root {
    @apply w-full flex flex-col gap-5;
    /* FIXME: padding/margin to prevent the stepper to disappear [calc(calc(100%+5rem))] pl-20 mr-20 */
}
</style>
