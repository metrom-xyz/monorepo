<script setup lang="ts">
import MuiPairSelect from "@/ui/pair-select/MuiPairSelect.vue";
import { ref } from "vue";
import type { PairPickerTypes } from "./types";
import { watchEffect } from "vue";
import { usePairs } from "@/composables/usePairs";
import type { SupportedAmm } from "@/types";

const props = defineProps<PairPickerTypes>();
const emits = defineEmits<{
    complete: [];
}>();

const open = ref(false);

const { pairs, loading } = usePairs({
    chainId: props.state.network?.value,
    amm: props.state.amm?.value as SupportedAmm,
    // TODO: filtering/pagination?
});

watchEffect(() => {
    if (props.completed || !props.state.pair) return;
    emits("complete");
});
</script>
<template>
    <div class="pair_picker__root">
        <MuiPairSelect
            :open="open"
            :pairs="pairs"
            :loading="loading"
            :disabled="!pairs || pairs.length === 0"
            v-model="$props.state.pair"
            @dismiss="open = false"
            @click="open = true"
            :messages="{
                inputPlaceholder: $t('campaign.pair.select.placeholder'),
                search: {
                    inputLabel: $t('campaign.pair.select.search.inputLabel'),
                    inputPlaceholder: $t(
                        'campaign.pair.select.search.inputPlaceholder',
                    ),
                    noPairs: $t('campaign.pair.select.search.noPairs'),
                },
            }"
        />
    </div>
</template>
<style>
.pair_picker__root {
    @apply p-3;
}
</style>
