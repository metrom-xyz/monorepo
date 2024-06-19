<script setup lang="ts">
import type { TabsProps } from "./types";
import MuiTab from "./tab/MuiTab.vue";
import { computed, onMounted } from "vue";
import { useSlots } from "vue";
import { ref } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { onUnmounted } from "vue";

const props = defineProps<TabsProps>();
defineSlots<{
    default: typeof MuiTab;
}>();
const emits = defineEmits<{
    change: [value: number];
}>();

const slots = useSlots();

const wrapper = ref<HTMLElement | null>(null);
const tabsWidth = ref(0);
const transition = ref(false);

function handleTabOnClick(value: number) {
    emits("change", value);
}

useResizeObserver(wrapper, (entries) => {
    const entry = entries[0];
    const { width } = entry.contentRect;
    tabsWidth.value = width;
});

const translate = computed(() => {
    if (!slots.default || !tabsWidth.value) return 0;

    const tabs = slots.default();
    return (tabsWidth.value / tabs.length) * props.value;
});

const activeWidth = computed(() => {
    if (!slots.default || !tabsWidth.value) return 0;

    const tabs = slots.default();
    return tabsWidth.value / tabs.length;
});

// enable the css transition after x ms (the transition duration)
// to avoid having the background component moving from the start
// position on every mount
let timeout: any;
onMounted(() => {
    timeout = setTimeout(() => {
        transition.value = true;
    }, 200);
});

onUnmounted(() => {
    clearTimeout(timeout);
});
</script>
<template>
    <div class="mui_tabs__root">
        <div ref="wrapper" v-if="$slots.default" class="mui_tabs__wrapper">
            <component
                :value="index"
                :key="index"
                :is="tab"
                v-for="(tab, index) in $slots.default()"
                :onClick="handleTabOnClick"
                :class="{ mui_tabs__root_not_active: index !== $props.value }"
            ></component>
            <div
                class="mui_tabs_active"
                :class="{
                    mui_tabs_disable_transition: !transition,
                }"
                :style="{
                    transform: `translateX(${translate}px)`,
                    width: `${activeWidth}px`,
                }"
            ></div>
        </div>
    </div>
</template>
<style>
.mui_tabs__root {
    @apply z-[1] p-1.5 bg-gray-100 rounded-xl;
}

.mui_tabs__wrapper {
    @apply relative flex;
}

.mui_tabs_active {
    @apply z-[-1] absolute h-full bg-white rounded-xl transition-transform duration-200 ease-in-out;
}

.mui_tabs_disable_transition {
    @apply transition-none;
}

.mui_tabs__root_not_active {
    @apply opacity-40;
}
</style>
