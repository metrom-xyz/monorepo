<script setup lang="ts">
import MetromRoundLogo from "@/icons/MetromRoundLogo.vue";
import { useAuth } from "@/stores/auth";
import MuiCard from "@/ui/MuiCard.vue";
import MuiButton from "@/ui/button/MuiButton.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { signMessage } from "@wagmi/core";
import { useAccount, useWagmiConfig } from "vevm";
import { watchEffect } from "vue";
import { ref } from "vue";
import ConnectWallet from "./ConnectWallet.vue";

const signedAuthMessage = ref<string>();
const loading = ref(false);

const config = useWagmiConfig();
const account = useAccount();
const { setJwtAuthToken } = useAuth();

async function handleSignOnClick() {
    if (!account.value.address) return;
    loading.value = true;

    try {
        // TODO: fetch message to sign from API
        // const message = await fetch(...)
        signedAuthMessage.value = await signMessage(config, {
            message: "mock_message",
            account: account.value.address,
        });
    } catch (error) {
        console.error(
            `could not get and sign the login message for address ${account.value.address}`,
            error,
        );
    } finally {
        loading.value = false;
    }
}

watchEffect(() => {
    if (!signedAuthMessage.value) return;

    // TODO: fetch jwt token from API
    setJwtAuthToken("fake_jwt_token");
});
</script>
<template>
    <div class="authenticate_account__root">
        <MuiCard>
            <template #content>
                <div class="authenticate_account__content">
                    <MuiTypography h4 bold>
                        {{ $t("authenticate.title") }}
                    </MuiTypography>
                    <MetromRoundLogo
                        class="authenticate_account__metrom__logo"
                    />
                    <MuiTypography>
                        {{ $t("authenticate.description") }}
                    </MuiTypography>
                    <MuiButton
                        v-if="account.address"
                        @click="handleSignOnClick"
                        :loading="loading"
                    >
                        <MuiTypography uppercase>
                            {{ $t("authenticate.sign") }}
                        </MuiTypography>
                    </MuiButton>
                    <ConnectWallet v-else />
                </div>
            </template>
        </MuiCard>
    </div>
</template>
<style>
.authenticate_account__root {
}

.authenticate_account__metrom__logo {
    @apply h-40;
}

.authenticate_account__content {
    @apply flex flex-col items-center text-center p-6 gap-6;
}
</style>
