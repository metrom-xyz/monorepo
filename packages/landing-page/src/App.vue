<script setup lang="ts">
import MetNavigationBar from "./components/MetNavigationBar.vue";
import MetHero from "./components/MetHero.vue";
import MetAudits from "./components/MetAudits.vue";
</script>
<template>
    <div class="app__container">
        <MetNavigationBar />
        <div class="app__content">
            <MetHero />
            <MetAudits />
        </div>
    </div>
</template>
<style>
.app__container {
    @apply min-h-screen
        flex
        flex-col
        bg-gray-300
        bg-3
        bg-dots
        px-6
        sm:gap-16
        md:px-12
        lg:px-44;
}

.app__content {
    @apply flex flex-col gap-24;
}
</style>
