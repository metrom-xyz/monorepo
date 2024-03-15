<script setup lang="ts">
import { RouterView } from "vue-router";
import MetromLogoIcon from "./icons/MetromLogoIcon.vue";
import NavigationBar from "./components/navigation/NavigationBar.vue";
import MuiTypography from "./ui/typography/MuiTypography.vue";
</script>
<template>
    <div class="app__container">
        <header class="app__header">
            <MetromLogoIcon />
            <div class="app__nav">
                <NavigationBar />
            </div>
            <div>account todo</div>
        </header>
        <div class="app__content">
            <RouterView />
        </div>
        <footer>
            <MuiTypography uppercase>
                <i18n-t keypath="powered" for="carrot">
                    <b>{{ $t("carrot") }}</b>
                </i18n-t>
            </MuiTypography>
        </footer>
    </div>
</template>
<style>
.app__container {
    @apply h-screen flex flex-col gap-14 items-center py-8 px-12 bg-gray-100 bg-3 bg-dots;
}

.app__header {
    @apply w-full flex justify-between;
}

.app__content {
    @apply flex-grow mt-10;
}

.app__nav {
    @apply flex gap-2;
}
</style>
