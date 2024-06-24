<script setup lang="ts">
import makeBlockie from "ethereum-blockies-base64";
import { useEnsAvatar, useEnsName } from "vevm";
import type { AvatarProps } from "./types";

const props = defineProps<AvatarProps>();

const { ensName } = useEnsName({ address: props.address });
const { ensAvatar } = useEnsAvatar({ name: ensName.value || "" });
</script>
<template>
    <img :src="ensAvatar || makeBlockie(address)" class="met_avatar__root" />
</template>
<style>
.met_avatar__root {
    @apply h-9 w-9 rounded-full;
}
</style>
