<script setup lang="ts">
import MetNavigationBar from "./components/MetNavigationBar.vue";
import MetHero from "./components/MetHero.vue";
</script>
<template>
    <div class="app__container">
        <MetNavigationBar />
        <MetHero />
    </div>
</template>
<style>
.app__container {
    @apply min-h-screen
        flex
        flex-col
        bg-gray-300
        bg-3
        bg-dots;
}
</style>
