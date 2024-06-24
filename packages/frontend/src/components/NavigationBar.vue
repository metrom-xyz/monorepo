<script setup lang="ts">
import { useSelectedChain } from "@/composables/useSelectedChain";
import DocumentIcon from "@/icons/DocumentIcon.vue";
import FolderIcon from "@/icons/FolderIcon.vue";
import { MetTypography, MetTabs, MetTab } from "@metrom-xyz/ui";
import { RouterLink } from "vue-router";
import { ref } from "vue";

const chain = useSelectedChain();

const tab = ref(0);

function handleTabChange(value: number | undefined) {
    console.log({ value });
    if (value === undefined) return;
    tab.value = value;
}
</script>
<template>
    <nav class="navigation_bar__root">
        <div class="navigation_bar__wrapper">
            <MetTabs @change="handleTabChange" :value="tab">
                <MetTab>
                    <RouterLink :to="`/?chain=${chain}`">
                        <div class="navigation_bar__link">
                            <FolderIcon />
                            <MetTypography>
                                {{ $t("navigation.campaigns.all") }}
                            </MetTypography>
                        </div>
                    </RouterLink>
                </MetTab>
                <MetTab>
                    <RouterLink :to="`/create?chain=${chain}`">
                        <div class="navigation_bar__link">
                            <DocumentIcon />
                            <MetTypography>
                                {{ $t("navigation.campaigns.create") }}
                            </MetTypography>
                        </div>
                    </RouterLink>
                </MetTab>
            </MetTabs>
            <div
                class="navigation_bar__link__active"
                :class="{
                    navigation_bar__link_slide_right: $route.name === 'create',
                }"
            ></div>
        </div>
    </nav>
</template>
<style>
/* .navigation_bar__root {
    @apply h-14 flex bg-gray-100 rounded-xxl p-1.5 absolute left-1/2 -translate-x-1/2;
}

.navigation_bar__wrapper {
    @apply relative flex;
} */

.navigation_bar__link {
    @apply flex items-center gap-2 whitespace-nowrap;
}

/* .navigation_bar__link__active {
    @apply -z-[1] absolute h-full w-1/2 bg-white rounded-xl transition-transform duration-200 ease-in-out;
}

.navigation_bar__link_slide_right {
    @apply translate-x-full;
} */
</style>
