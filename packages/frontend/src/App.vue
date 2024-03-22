<script setup lang="ts">
import { RouterView } from "vue-router";
import MetromLogoIcon from "./icons/MetromLogoIcon.vue";
import NavigationBar from "./components/NavigationBar.vue";
import MuiTypography from "./ui/typography/MuiTypography.vue";
import UserAccount from "./components/UserAccount.vue";
</script>
<template>
    <div class="app__container">
        <header class="app__header">
            <MetromLogoIcon />
            <div class="app__nav">
                <NavigationBar />
            </div>
            <UserAccount />
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
    @apply min-h-screen flex flex-col gap-14 items-center p-8 bg-gray-300 bg-3 bg-dots;
}

.app__header {
    @apply w-full flex justify-between;
}

.app__content {
    @apply flex-grow;
}

.app__nav {
    @apply flex gap-2;
}
</style>
