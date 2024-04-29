<script setup lang="ts">
import DocumentIcon from "@/icons/DocumentIcon.vue";
import FolderIcon from "@/icons/FolderIcon.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { RouterLink } from "vue-router";
</script>
<template>
    <nav class="navigation_bar__root">
        <RouterLink to="/">
            <div
                class="navigation_bar__link"
                :class="{
                    navigation_bar__link__active: $route.name === 'campaigns',
                }"
            >
                <FolderIcon />
                <MuiTypography lg>
                    {{ $t("navigation.campaigns.all") }}
                </MuiTypography>
            </div>
        </RouterLink>
        <RouterLink to="/create">
            <div
                class="navigation_bar__link"
                :class="{
                    navigation_bar__link__active: $route.name === 'create',
                }"
            >
                <DocumentIcon />
                <MuiTypography lg>
                    {{ $t("navigation.campaigns.create") }}
                </MuiTypography>
            </div>
        </RouterLink>
    </nav>
</template>
<style>
.navigation_bar__root {
    @apply h-14 flex bg-gray-100 rounded-xxl p-1.5 absolute left-1/2 -translate-x-1/2;
}

.navigation_bar__link {
    @apply h-full w-fit flex items-center gap-2 bg-transparent rounded-xxl px-3;
}

.navigation_bar__link__active {
    @apply bg-white;
}
</style>
