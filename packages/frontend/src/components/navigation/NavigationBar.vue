<script setup lang="ts">
import DocumentIcon from "@/icons/DocumentIcon.vue";
import FolderIcon from "@/icons/FolderIcon.vue";
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
                {{ $t("navigation.campaigns.all") }}
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
                {{ $t("navigation.campaigns.create") }}
            </div>
        </RouterLink>
    </nav>
</template>
<style>
.navigation_bar__root {
    @apply flex bg-gray-300 rounded-[14px] p-1.5 absolute left-1/2 -translate-x-1/2;
}

.navigation_bar__link {
    @apply flex gap-2 bg-transparent rounded-xl py-3.5 px-3;
}

.navigation_bar__link__active {
    @apply bg-white;
}
</style>
