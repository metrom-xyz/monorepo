<script setup lang="ts">
import { type RemoteLogoProps } from "./types";
import { computed, ref } from "vue";
import CuiSkeleton from "../skeleton/MetSkeleton.vue";

const props = defineProps<RemoteLogoProps>();

const resolvedDefaultText = computed(() =>
    props.defaultText
        ? props.defaultText.length > 4
            ? `${props.defaultText.slice(0, 4).toUpperCase()}`
            : props.defaultText.toUpperCase()
        : "?",
);

const resolvedSrc = computed(() => {
    if (!props.address || !props.chain) return "";
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${props.chain}/assets/${props.address}/logo.png`;
});

const fallback = ref(false);
</script>
<template>
    <div
        v-if="!fallback"
        class="cui_remote_logo__root"
        :class="{
            cui_remote_logo__sm: props.sm,
            cui_remote_logo__lg: props.lg,
            cui_remote_logo__xl: props.xl,
            cui_remote_logo__xxl: props.xxl,
        }"
    >
        <CuiSkeleton circular class="cui_remote_logo__skeleton" width="100%" />
        <img
            class="cui_remote_logo__img"
            :src="resolvedSrc"
            @error="fallback = true"
        />
    </div>
    <div
        v-else
        class="cui_remote_logo__fallback"
        :class="{
            cui_remote_logo__fallback__sm: props.sm,
            cui_remote_logo__fallback__lg: props.lg,
            cui_remote_logo__fallback__xl: props.xl,
            cui_remote_logo__fallback__xxl: props.xxl,
        }"
    >
        {{ resolvedDefaultText }}
    </div>
</template>
<style>
.cui_remote_logo__root {
    @apply relative w-7 h-7;
}

.cui_remote_logo__sm {
    @apply w-6 h-6;
}

.cui_remote_logo__lg {
    @apply w-8 h-8;
}

.cui_remote_logo__xl {
    @apply w-9 h-9;
}

.cui_remote_logo__xxl {
    @apply w-10 h-10;
}

.cui_remote_logo__skeleton {
    @apply absolute;
}

.cui_remote_logo__skeleton__sm {
    @apply w-6 h-6;
}

.cui_remote_logo__skeleton__lg {
    @apply w-8 h-8;
}

.cui_remote_logo__skeleton__xl {
    @apply w-9 h-9;
}

.cui_remote_logo__img {
    @apply absolute w-full h-full rounded-full;
}

.cui_remote_logo__fallback {
    @apply bg-black
        text-white
        dark:bg-white
        dark:text-black
        rounded-full
        flex
        justify-center
        items-center
        text-[0.5rem]
        w-7
        h-7;
}

.cui_remote_logo__fallback__sm {
    @apply w-6 h-6 text-[0.4rem];
}

.cui_remote_logo__fallback__lg {
    @apply w-8 h-8 text-[0.6rem];
}

.cui_remote_logo__fallback__xl {
    @apply w-9 h-9 text-[0.7rem];
}

.cui_remote_logo__fallback__xxl {
    @apply w-10 h-10 text-sm;
}
</style>
