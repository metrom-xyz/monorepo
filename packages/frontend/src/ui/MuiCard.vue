<script setup lang="ts">
defineSlots<{
    title: unknown;
    content: unknown;
}>();
</script>
<template>
    <div class="mui_card__root">
        <div class="mui_card__title">
            <slot name="title"></slot>
        </div>
        <div class="mui_card__content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
<style>
.mui_card__root {
    @apply bg-white w-full rounded-[30px];
}

.mui_card__title {
    @apply w-full flex items-center justify-between pt-6 pb-5 px-6 border-b border-gray-100;
}
</style>
