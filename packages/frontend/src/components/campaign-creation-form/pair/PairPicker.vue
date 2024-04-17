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
    return CHAIN_DATA[props.state.network?.value as SupportedChain].amms.find(
        (amm) => amm.slug === props.state.amm?.value,
    );
});

const { pairs, loading } = usePairs({
    amm: amm.value,
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
