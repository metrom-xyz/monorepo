<script setup lang="ts">
import MetNavigationBar from "./components/MetNavigationBar.vue";
import MetHero from "./components/MetHero.vue";
import MetAudits from "./components/MetAudits.vue";
import MetFeatures from "./components/features/MetFeatures.vue";
import MetPartners from "./components/MetPartners.vue";
import MetDeepDive from "./components/MetDeepDive.vue";
import MetFaqs from "./components/faqs/MetFaqs.vue";
import MetSocials from "./components/MetSocials.vue";
import MetAbout from "./components/MetAbout.vue";
</script>
<template>
    <div class="app__container">
        <div class="app__content__wrapper">
            <MetNavigationBar />
            <div class="app__content">
                <MetHero />
                <MetAudits />
                <MetFeatures />
                <MetPartners />
                <MetDeepDive />
                <MetFaqs />
                <MetSocials />
                <MetAbout />
            </div>
        </div>
    </div>
</template>
<style>
.app__container {
    @apply min-h-screen
        flex
        justify-center
        bg-gray-300
        bg-3
        bg-dots
        px-6
        md:px-12
        lg:px-44;
}

.app__content__wrapper {
    @apply max-w-[1920px]
        w-full
        flex
        flex-col
        sm:gap-16;
}

.app__content {
    @apply flex flex-col gap-12 items-center sm:gap-24;
}
</style>
./components/features/MetFeatures.vue
