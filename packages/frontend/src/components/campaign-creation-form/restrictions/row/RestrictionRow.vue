<script setup lang="ts">
import { ref } from "vue";
import type { RestrictionRowProps } from "./types";
import { MetEns, MetAvatar, MetPopover } from "@metrom-xyz/ui";

defineProps<RestrictionRowProps>();

const popover = ref(false);
</script>
<template>
    <MetPopover :open="popover" :placement="'top'">
        <div class="restriction_row__address__wrapper">
            <div
                class="restriction_row__address"
                @mouseenter="popover = true"
                @mouseleave="popover = false"
            >
                <MetAvatar :address="$props.address" />
                <MetEns :address="$props.address" short />
            </div>
            <XIcon
                @click="$props.onRemove"
                class="restriction_row__remove__icon"
            />
        </div>
        <template #popover>
            <div class="restriction_row__address__popover">
                <MetEns :address="$props.address" medium />
            </div>
        </template>
    </MetPopover>
</template>
<style>
.restriction_row__address__wrapper {
    @apply flex justify-between items-center gap-4 pr-4;
}

.restriction_row__address {
    @apply flex gap-4 items-center;
}

.restriction_row__remove__icon {
    @apply hover:cursor-pointer;
}

.restriction_row__address__popover {
    @apply p-3.5;
}
</style>
