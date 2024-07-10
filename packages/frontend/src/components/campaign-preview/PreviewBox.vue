<script setup lang="ts">
defineSlots<{ title: unknown; default: unknown }>();
</script>
<template>
    <div class="preview_box__root">
        <div class="preview_box__title">
            <slot name="title"></slot>
        </div>
        <div class="preview_box__content">
            <slot></slot>
        </div>
    </div>
</template>
<style>
.preview_box__root {
    @apply flex
        flex-col
        bg-gray-100
        rounded-[30px];
}

.preview_box__title {
    @apply px-7 pt-4 pb-2 border-b border-gray-400;
}

.preview_box__content {
    @apply px-7 py-4;
}
</style>
