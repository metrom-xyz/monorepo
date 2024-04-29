<script setup lang="ts">
import { RouterView } from "vue-router";
import MetromLogoIcon from "./icons/MetromLogoIcon.vue";
import NavigationBar from "./components/NavigationBar.vue";
import MuiTypography from "./ui/typography/MuiTypography.vue";
import UserAccount from "./components/UserAccount.vue";
import { useTokens } from "./stores/tokens";
import { isChainSupported } from "./utils/chain";
import MuiCard from "./ui/MuiCard.vue";
import { useSelectedChain } from "./composables/useSelectedChain";

const selectedChain = useSelectedChain();

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
            <div v-if="!!selectedChain && isChainSupported(selectedChain)">
                <RouterView />
            </div>
            <MuiCard v-else>
                <template #title>
                    <MuiTypography medium lg>
                        {{ $t("chain.unsupported.title") }}
                    </MuiTypography>
                </template>
                <template #content>
                    <div class="app__network__unsupported">
                        <MuiTypography>
                            {{ $t("chain.unsupported.content") }}
                        </MuiTypography>
                    </div>
                </template>
            </MuiCard>
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

.app__logo {
    @apply h-8 w-36;
}

.app__content {
    @apply flex-grow;
}

.app__network__unsupported {
    @apply p-3;
}

.app__nav {
    @apply flex gap-2;
}
</style>
./composables/useSelectedChain
