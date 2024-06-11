<script setup lang="ts">
import { useSelectedChain } from "@/composables/useSelectedChain";
import DocumentIcon from "@/icons/DocumentIcon.vue";
import FolderIcon from "@/icons/FolderIcon.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { RouterLink } from "vue-router";

const chain = useSelectedChain();
</script>
<template>
    <nav class="navigation_bar__root">
        <div class="navigation_bar__wrapper">
            <RouterLink :to="`/?chain=${chain}`">
                <div class="navigation_bar__link">
                    <FolderIcon />
                    <MuiTypography>
                        {{ $t("navigation.campaigns.all") }}
                    </MuiTypography>
                </div>
            </RouterLink>
            <RouterLink :to="`/create?chain=${chain}`">
                <div class="navigation_bar__link">
                    <DocumentIcon />
                    <MuiTypography>
                        {{ $t("navigation.campaigns.create") }}
                    </MuiTypography>
                </div>
            </RouterLink>
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
.navigation_bar__root {
    @apply h-14 flex bg-gray-100 rounded-xxl p-1.5 absolute left-1/2 -translate-x-1/2;
}

.navigation_bar__wrapper {
    @apply relative flex;
}

.navigation_bar__link {
    @apply h-full w-fit flex items-center gap-2 bg-transparent rounded-xxl px-3;
}

.navigation_bar__link__active {
    @apply -z-[1] absolute h-full w-1/2 bg-white rounded-xl transition-transform duration-200 ease-in-out;
}

.navigation_bar__link_slide_right {
    @apply translate-x-full;
}
</style>
