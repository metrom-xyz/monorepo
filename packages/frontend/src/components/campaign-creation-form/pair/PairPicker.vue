<script setup lang="ts">
import MuiPairSelect from "@/ui/pair-select/MuiPairSelect.vue";
import { computed, ref } from "vue";
import type { PairPickerTypes } from "./types";
import { watchEffect } from "vue";
import { usePairs } from "@/composables/usePairs";
import { CHAIN_DATA } from "@/commons";
import type { SupportedChain } from "sdk";

const props = defineProps<PairPickerTypes>();
const emits = defineEmits<{
    complete: [];
}>();

const open = ref(false);

const amm = computed(() => {
    return CHAIN_DATA[props.state.network as SupportedChain].amms.find(
        (amm) => amm.slug === props.state.amm?.value,
    );
});

// fetches the pairs every time the network or amm changes
const { pairs, loading } = usePairs(
    computed(() => ({
        amm: amm.value,
    })),
);

watchEffect(() => {
    if (props.completed || !props.state.pair) return;
    emits("complete");
});

// if either the selected network or amm changes, the selected pair has to be reset
// watch([amm], () => {
//     if (props.state.pair) emits("reset");
// });
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
                inputPlaceholder:
                    (!loading && !pairs) || pairs?.length === 0
                        ? $t('campaign.pair.select.placeholderNoPairs')
                        : $t('campaign.pair.select.placeholder'),
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
