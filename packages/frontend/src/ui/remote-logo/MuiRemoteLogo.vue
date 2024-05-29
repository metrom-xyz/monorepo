<script setup lang="ts">
import { type RemoteLogoProps } from "./types";
import { computed } from "vue";
import MuiSkeleton from "../skeleton/MuiSkeleton.vue";
import { useTokens } from "@/stores/tokens";

const props = defineProps<RemoteLogoProps>();

const tokenLists = useTokens();

const token = computed(() => {
    return props.address && tokenLists.getToken(props.address);
});

const resolvedDefaultText = computed(() =>
    props.defaultText
        ? props.defaultText.length > 4
            ? `${props.defaultText.slice(0, 4).toUpperCase()}`
            : props.defaultText.toUpperCase()
        : "?",
);
</script>
<template>
    <div
        v-if="!!token"
        class="mui_remote_logo__root"
        :class="{
            mui_remote_logo__sm: $props.sm,
            mui_remote_logo__lg: $props.lg,
            mui_remote_logo__xl: $props.xl,
            mui_remote_logo__xxl: $props.xxl,
        }"
    >
        <MuiSkeleton
            v-if="!token.logoURI"
            circular
            class="mui_remote_logo__skeleton"
            width="100%"
        />
        <img v-else class="mui_remote_logo__img" :src="token.logoURI" />
    </div>
    <div
        v-else
        class="mui_remote_logo__fallback"
        :class="{
            mui_remote_logo__fallback__sm: $props.sm,
            mui_remote_logo__fallback__lg: $props.lg,
            mui_remote_logo__fallback__xl: $props.xl,
            mui_remote_logo__fallback__xxl: $props.xxl,
        }"
    >
        {{ resolvedDefaultText }}
    </div>
</template>
<style>
.mui_remote_logo__root {
    @apply relative w-7 h-7;
}

.mui_remote_logo__sm {
    @apply w-6 h-6;
}

.mui_remote_logo__lg {
    @apply w-8 h-8;
}

.mui_remote_logo__xl {
    @apply w-9 h-9;
}

.mui_remote_logo__xxl {
    @apply w-10 h-10;
}

.mui_remote_logo__skeleton {
    @apply absolute;
}

.mui_remote_logo__skeleton__sm {
    @apply w-6 h-6;
}

.mui_remote_logo__skeleton__lg {
    @apply w-8 h-8;
}

.mui_remote_logo__skeleton__xl {
    @apply w-9 h-9;
}

.mui_remote_logo__img {
    @apply absolute w-full h-full rounded-full bg-white;
}

.mui_remote_logo__fallback {
    @apply bg-black
        text-white
        rounded-full
        select-none
        flex
        justify-center
        items-center
        text-[0.5rem]
        w-7
        h-7;
}

.mui_remote_logo__fallback__sm {
    @apply w-6 h-6 text-[0.4rem];
}

.mui_remote_logo__fallback__lg {
    @apply w-8 h-8 text-[0.6rem];
}

.mui_remote_logo__fallback__xl {
    @apply w-9 h-9 text-[0.7rem];
}

.mui_remote_logo__fallback__xxl {
    @apply w-10 h-10 text-sm;
}
</style>
