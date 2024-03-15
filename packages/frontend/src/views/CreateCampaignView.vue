<script setup lang="ts">
import MuiCard from "@/ui/MuiCard.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
</script>
<template>
    <div class="create_campaign__root">
        <MuiTypography h3>{{ $t("campaign.create") }}</MuiTypography>
        <MuiCard>
            <template #title>
                <MuiTypography medium h4>Card title</MuiTypography>
            </template>
            <template #content>
                <div class="p-4 w-96"></div>
            </template>
        </MuiCard>
    </div>
</template>
<style>
.create_campaign__root {
    @apply flex flex-col gap-9 items-center;
}
</style>
