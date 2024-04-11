<script setup lang="ts">
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import type { PreviewDeployButtonProps } from "./types";
import { useAccount, useConnect } from "vevm";
import EmptyWalletIcon from "@/icons/EmptyWalletIcon.vue";
import { injected } from "@wagmi/core";
import LineArrowRightIcon from "@/icons/LineArrowRightIcon.vue";
import SendIcon from "@/icons/SendIcon.vue";

const props = defineProps<PreviewDeployButtonProps>();

const account = useAccount();
const { connect } = useConnect();

function handleOnClick() {
    if (!!account.value.address && props.onClick) {
        props.onClick();
        return;
    }

    connect({ connector: injected() });
}
</script>
<template>
    <button
        class="preview_deploy_button__root"
        v-bind="$attrs"
        :class="{
            preview_deploy_button__root_deploy: $props.variant === 'deploy',
        }"
        @click="handleOnClick"
    >
        <div v-if="!account.address" class="preview_deploy_button__content">
            <div
                class="preview_deploy_button__icon preview_deploy_button__icon_hidden"
            ></div>
            <MuiTypography class="preview_deploy_button__text" medium>
                {{ $t("campaign.deploy.connectWallet") }}
            </MuiTypography>
            <div class="preview_deploy_button__icon">
                <EmptyWalletIcon />
            </div>
        </div>
        <div
            v-else-if="$props.variant === 'preview'"
            class="preview_deploy_button__content"
        >
            <div
                class="preview_deploy_button__icon preview_deploy_button__icon_hidden"
            ></div>
            <MuiTypography class="preview_deploy_button__text" medium>
                {{ $t("campaign.deploy.preview") }}
            </MuiTypography>
            <div class="preview_deploy_button__icon">
                <LineArrowRightIcon />
            </div>
        </div>
        <div v-else class="preview_deploy_button__content" medium>
            <div
                class="preview_deploy_button__icon preview_deploy_button__icon_hidden"
            ></div>
            <MuiTypography medium>
                {{ $t("campaign.deploy.launch") }}
            </MuiTypography>
            <div
                class="preview_deploy_button__icon preview_deploy_button__icon__deploy"
            >
                <SendIcon />
            </div>
        </div>
    </button>
</template>
<style>
.preview_deploy_button__root {
    @apply bg-blue w-full px-4 py-3 rounded-[30px] disabled:bg-gray-600;
}

.preview_deploy_button__root_deploy {
    @apply bg-green;
}

.preview_deploy_button__content {
    @apply flex items-center justify-between;
}

.preview_deploy_button__text {
    @apply text-white flex-1;
}

.preview_deploy_button__icon {
    @apply p-4 rounded-full border border-white;
}

.preview_deploy_button__icon_hidden {
    @apply invisible;
}

.preview_deploy_button__icon__deploy {
    @apply text-black border-black;
}
</style>
