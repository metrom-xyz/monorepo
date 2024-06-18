<script setup lang="ts">
import { RouterView } from "vue-router";
import MetromLogoIcon from "./icons/MetromLogoIcon.vue";
import NavigationBar from "./components/NavigationBar.vue";
import UserAccount from "./components/UserAccount.vue";
import { useTokens } from "./stores/tokens";
import MultiChainLinks from "./components/MultiChainLinks.vue";

// TODO: improve tokens fetching
const tokenListsStore = useTokens();
tokenListsStore.fetchTokensLists();
</script>
<template>
    <div class="app__container">
        <header class="app__header">
            <MetromLogoIcon class="app__logo" />
            <div class="app__nav">
                <NavigationBar />
            </div>
            <UserAccount />
        </header>
        <div class="app__content">
            <MultiChainLinks>
                <RouterView />
            </MultiChainLinks>
        </div>
    </div>
</template>
<style>
.app__container {
    @apply min-h-screen
        flex
        flex-col
        gap-14
        items-center
        p-8
        bg-gray-300
        bg-3
        bg-dots;
}

.app__header {
    @apply w-full flex justify-between;
}

.app__logo {
    @apply h-8 w-36;
}

.app__content {
    @apply flex-grow;
}

.app__nav {
    @apply flex gap-2;
}
</style>
