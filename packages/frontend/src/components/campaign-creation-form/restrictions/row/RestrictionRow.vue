<script setup lang="ts">
import { ref } from "vue";
import type { RestrictionRowProps } from "./types";
import MuiEns from "@/ui/ens/MuiEns.vue";
import XIcon from "@/icons/XIcon.vue";
import MuiAvatar from "@/ui/avatar/MuiAvatar.vue";
import MuiPopover from "@/ui/popover/MuiPopover.vue";

defineProps<RestrictionRowProps>();

const popover = ref(false);
</script>
<template>
    <MuiPopover :open="popover" :placement="'top'">
        <div class="restriction_row__address__wrapper">
            <div
                class="restriction_row__address"
                @mouseenter="popover = true"
                @mouseleave="popover = false"
            >
                <MuiAvatar :address="$props.address" />
                <MuiEns :address="$props.address" short />
            </div>
            <XIcon
                @click="$props.onRemove"
                class="restriction_row__remove__icon"
            />
        </div>
        <template #popover>
            <div class="restriction_row__address__popover">
                <MuiEns :address="$props.address" medium />
            </div>
        </template>
    </MuiPopover>
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
