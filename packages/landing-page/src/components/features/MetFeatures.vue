<script setup lang="ts">
import MetFeature from "./MetFeature.vue";

// TODO: add illustrations
const FEATURES = [
    {
        title: "features.flow.title",
        description: "features.flow.description",
        image: "/placeholder-feature.png",
    },
    {
        title: "features.incentives.title",
        description: "features.incentives.description",
        image: "/placeholder-feature.png",
    },
    {
        title: "features.campaign.title",
        description: "features.campaign.description",
        image: "/placeholder-feature.png",
    },
];
</script>
<template>
    <section id="features" class="features__root">
        <MetFeature
            :key="index"
            v-for="(feature, index) in FEATURES"
            :title="feature.title"
            :description="feature.description"
            :image="feature.image"
        />
    </section>
</template>
<style>
.features__root {
    @apply flex
        flex-col
        gap-8
        items-center
        max-w-6xl;
}
</style>
