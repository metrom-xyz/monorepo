<script setup lang="ts">
import WalletIcon from "@/icons/WalletIcon.vue";
import PowerIcon from "@/icons/PowerIcon.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { shortenAddress } from "@/utils/address";
import { useAccount, useDisconnect } from "vevm";
import ChainSelect from "./ChainSelect.vue";
import ConnectWallet from "./ConnectWallet.vue";

const account = useAccount();
const { disconnect } = useDisconnect();

function handleDisconnectOnClick() {
    disconnect({});
}
</script>
<template>
    <div class="user_account__root">
        <ChainSelect />
        <div class="user_account__wrapper">
            <template v-if="account.address">
                <div
                    class="user_account__icon__wrapper user_account__icon__wrapper__left"
                >
                    <WalletIcon />
                </div>
                <MuiTypography uppercase class="user_account__address">
                    {{ shortenAddress(account.address) }}
                </MuiTypography>
                <div
                    @click="handleDisconnectOnClick"
                    class="user_account__icon__wrapper user_account__icon__wrapper__right"
                >
                    <PowerIcon />
                </div>
            </template>
            <ConnectWallet v-else class="user_account__connect__button" />
        </div>
    </div>
</template>
<style>
.user_account__root {
    @apply flex items-center gap-4;
}

.user_account__wrapper {
    @apply w-fit bg-white rounded-xxl flex items-center gap-3;
}

.user_account__icon__wrapper {
    @apply h-full bg-gray-100 p-4;
}

.user_account__icon__wrapper__left {
    @apply rounded-l-xxl;
}

.user_account__icon__wrapper__right {
    @apply hover:cursor-pointer rounded-r-xxl;
}

.user_account__address {
    @apply pr-4;
}

.user_account__connect__button {
    @apply h-14;
}
</style>
