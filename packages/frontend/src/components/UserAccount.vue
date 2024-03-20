<script setup lang="ts">
import WalletIcon from "@/icons/WalletIcon.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { shortenAddress } from "@/utils/address";
import { injected } from "@wagmi/core";
import { useAccount, useConnect } from "vevm";

const account = useAccount();
const { connect } = useConnect();
</script>
<template>
    <div class="user_account__root">
        <template v-if="account.address && account.chain">
            <div class="user_account__icon_wrapper">
                <WalletIcon />
            </div>
            <MuiTypography uppercase class="user_account__address">
                {{ shortenAddress(account.address) }}
            </MuiTypography>
            <div class="user_account__chain_symbol_wrapper">
                <MuiTypography uppercase>
                    {{ account.chain.nativeCurrency.name }}
                </MuiTypography>
            </div>
        </template>
        <div v-else class="user_account__connect_wrapper">
            <!-- TODO: implement connect button -->
            <button @click="connect({ connector: injected() })">connect</button>
        </div>
    </div>
</template>
<style>
.user_account__root {
    @apply w-fit bg-white rounded-[38px] flex items-center gap-3;
}

.user_account__icon_wrapper {
    @apply hidden lg:block bg-gray-100 p-4 rounded-full;
}

.user_account__address {
    @apply hidden lg:block;
}

.user_account__chain_symbol_wrapper {
    @apply bg-gray-100 p-4 rounded-full;
}

.user_account__connect_wrapper {
    @apply p-4;
}
</style>
