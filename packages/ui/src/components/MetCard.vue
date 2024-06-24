<script setup lang="ts">
defineSlots<{
    title: unknown;
    content: unknown;
}>();
</script>
<template>
    <div class="met_card__root">
        <div
            class="met_card__root__disabled__layer"
            :class="{ met_card__root__disabled__layer_active: $attrs.disabled }"
        ></div>
        <div v-if="!!$slots.title" class="met_card__title">
            <slot name="title"></slot>
        </div>
        <div class="met_card__content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
<style>
.met_card__root {
    @apply bg-white w-full rounded-[30px] border border-gray-400;
}

.met_card__root__disabled__layer {
    @apply bg-gray-500 opacity-40 z-10 w-full h-full rounded-[30px] absolute hidden;
}

.met_card__root__disabled__layer_active {
    @apply block;
}

.met_card__title {
    @apply w-full flex items-center justify-between pt-6 pb-4 px-6 border-b border-gray-400;
}
</style>
