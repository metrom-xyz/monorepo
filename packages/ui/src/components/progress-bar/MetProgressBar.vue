<script setup lang="ts">
import { computed } from "vue";
import type { ProgressBarProps } from "./types";

const props = defineProps<ProgressBarProps>();

const normalizedProgress = computed(() =>
    props.progress > 100 ? 100 : props.progress,
);
</script>
<template>
    <div class="met_progress_bar__root">
        <div
            :style="{ width: `${normalizedProgress}%` }"
            class="met_progress_bar__progress"
            :class="{ met_progress_bar__completed: normalizedProgress === 100 }"
        ></div>
    </div>
</template>
<style>
.met_progress_bar__root {
    @apply relative w-full rounded-lg h-2 bg-gray-500;
}

.met_progress_bar__progress {
    @apply absolute h-full rounded-lg bg-blue-200;
}

.met_progress_bar__completed {
    @apply bg-green;
}
</style>
