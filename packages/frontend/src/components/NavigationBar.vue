<script setup lang="ts">
import { useSelectedChain } from "@/composables/useSelectedChain";
import DocumentIcon from "@/icons/DocumentIcon.vue";
import FolderIcon from "@/icons/FolderIcon.vue";
import { useRouter } from "vue-router";
import { MetTab, MetTabs, MetTypography } from "@metrom-xyz/ui";
import { ref, watch } from "vue";

const chain = useSelectedChain();
const { currentRoute, push } = useRouter();

const tab = ref(0);

function handleTabChange(value: number | undefined) {
    if (value === undefined) return;
    push(!value ? `/?chain=${chain.value}` : `/create?chain=${chain.value}`);
}

watch(currentRoute, () => {
    if (currentRoute.value.name === "create") tab.value = 1;
    else tab.value = 0;
});
</script>
<template>
    <nav class="navigation_bar__root">
        <div class="navigation_bar__wrapper">
            <MetTabs @change="handleTabChange" :value="tab">
                <MetTab>
                    <div class="navigation_bar__link">
                        <FolderIcon />
                        <MetTypography>
                            {{ $t("navigation.campaigns.all") }}
                        </MetTypography>
                    </div>
                </MetTab>
                <MetTab>
                    <div class="navigation_bar__link">
                        <DocumentIcon />
                        <MetTypography>
                            {{ $t("navigation.campaigns.create") }}
                        </MetTypography>
                    </div>
                </MetTab>
            </MetTabs>
        </div>
    </nav>
</template>
<style>
.navigation_bar__root {
    @apply absolute left-1/2 -translate-x-1/2;
}

.navigation_bar__wrapper {
    @apply relative flex;
}

.navigation_bar__link {
    @apply flex items-center gap-2 whitespace-nowrap;
}
</style>
