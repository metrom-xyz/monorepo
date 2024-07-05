<script setup lang="ts">
import MetromRoundLogo from "@/icons/MetromRoundLogo.vue";
import { useLogin } from "@/stores/auth";
import { MetCard, MetButton, MetTypography } from "@metrom-xyz/ui";
import { signMessage } from "@wagmi/core";
import { useAccount, useWagmiConfig } from "vevm";
import { watchEffect } from "vue";
import { ref } from "vue";
import ConnectWallet from "./ConnectWallet.vue";
import { SERVICE_URLS } from "@metrom-xyz/sdk";

const signedLoginMessage = ref<string>();
const loading = ref(false);

const config = useWagmiConfig();
const account = useAccount();
const { setJwtToken } = useLogin();

async function handleSignOnClick() {
    if (!account.value.address) return;
    loading.value = true;

    try {
        const response = await fetch(
            `${SERVICE_URLS[__ENVIRONMENT__].dataManager}/login-message?address=${account.value.address}`,
        );
        if (!response.ok) throw new Error(await response.text());
        const { message } = (await response.json()) as { message: string };

        signedLoginMessage.value = await signMessage(config, {
            message: message,
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
    if (!signedLoginMessage.value) return;

    const getJwtAuthToken = async () => {
        try {
            loading.value = true;
            const response = await fetch(
                `${SERVICE_URLS[__ENVIRONMENT__].dataManager}/token`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        address: account.value.address,
                        signature: signedLoginMessage.value,
                    }),
                },
            );

            if (!response.ok) throw new Error(await response.text());

            const { token } = (await response.json()) as { token: string };
            setJwtToken(token);
        } catch (error) {
            console.error(
                `could not get the jwt token for address ${account.value.address}`,
                error,
            );
        } finally {
            loading.value = false;
        }
    };

    getJwtAuthToken();
});
</script>
<template>
    <MetCard>
        <template #content>
            <div class="authenticate_account__content">
                <MetTypography h4 bold>
                    {{ $t("authenticate.title") }}
                </MetTypography>
                <MetromRoundLogo class="authenticate_account__metrom__logo" />
                <MetTypography>
                    {{ $t("authenticate.description") }}
                </MetTypography>
                <MetButton
                    v-if="account.address"
                    @click="handleSignOnClick"
                    :loading="loading"
                >
                    <MetTypography uppercase>
                        {{ $t("authenticate.sign") }}
                    </MetTypography>
                </MetButton>
                <ConnectWallet v-else />
            </div>
        </template>
    </MetCard>
</template>
<style>
.authenticate_account__metrom__logo {
    @apply h-40;
}

.authenticate_account__content {
    @apply flex flex-col items-center text-center p-6 gap-6;
}
</style>
