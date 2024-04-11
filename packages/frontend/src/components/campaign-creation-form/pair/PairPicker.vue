<script setup lang="ts">
import MuiPairSelect from "@/ui/pair-select/MuiPairSelect.vue";
import type { Pair } from "@/ui/pair-select/types";
import { ref } from "vue";
import type { PairPickerTypes } from "./types";
import { watchEffect } from "vue";

// TODO: fetch
const pairs: Pair[] = [
    {
        id: "0x02f683bf41b869949268b7d7a7f6f9315b2bf7e7",
        token0: {
            chainId: 0,
            address: "0x27cd006548df7c8c8e9fdc4a67fa05c2e3ca5cf9",
            name: "test3",
            symbol: "tst3",
            decimals: 18,
        },
        token1: {
            chainId: 1,
            address: "0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9",
            name: "Celo native asset",
            symbol: "CELO",
            decimals: 18,
        },
        tvl: 5000,
    },
    {
        id: "0x043712ccd482e782bcc9e1b2128c9714ff24fddf",
        token0: {
            chainId: 0,
            address: "0x92724824f7fa4ee45142c29cbd0c3d4f6b609546",
            name: "TIMES Coin",
            symbol: "TIMES",
            decimals: 18,
        },
        token1: {
            chainId: 0,
            address: "0xa6920dd986896d5433b4f388fcb705947a6af835",
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
        },
        tvl: 5000,
    },
    {
        id: "0x045c1c5ee0807ed3a7fa8e63e5135e78462876cd",
        token0: {
            chainId: 0,
            address: "0xd8e7bbf912cc93db7383b8320b233cf6ee7d6757",
            name: "cryplo",
            symbol: "CLO",
            decimals: 9,
        },
        token1: {
            chainId: 0,
            address: "0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9",
            name: "Celo native asset",
            symbol: "CELO",
            decimals: 18,
        },
        tvl: 5000,
    },
];

const props = defineProps<PairPickerTypes>();
const emits = defineEmits<{
    complete: [];
}>();

const open = ref(false);

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
