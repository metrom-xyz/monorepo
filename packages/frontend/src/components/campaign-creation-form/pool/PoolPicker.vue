<script setup lang="ts">
import MuiPoolSelect from "@/ui/pool-select/MuiPoolSelect.vue";
import { computed, ref } from "vue";
import type { PoolPickerTypes } from "./types";
import { watchEffect } from "vue";
import { usePools } from "@/composables/usePools";
import { CHAIN_DATA } from "@/commons";
import type { SupportedChain } from "sdk";

const props = defineProps<PoolPickerTypes>();
const emits = defineEmits<{
    complete: [];
}>();

const open = ref(false);

const amm = computed(() => {
    return CHAIN_DATA[props.state.network as SupportedChain].amms.find(
        (amm) => amm.slug === props.state.amm?.value,
    );
});

// fetches the pools every time the network or amm changes
const { pools, loading } = usePools(
    computed(() => ({
        amm: amm.value,
    })),
);

watchEffect(() => {
    if (props.completed || !props.state.pool) return;
    emits("complete");
});
</script>
<template>
    <div class="pool_picker__root">
        <MuiPoolSelect
            :open="open"
            :pools="pools"
            :loading="loading"
            :disabled="!pools || pools.length === 0"
            v-model="$props.state.pool"
            @dismiss="open = false"
            @click="open = true"
            :messages="{
                inputPlaceholder:
                    (!loading && !pools) || pools?.length === 0
                        ? $t('campaign.pool.select.placeholderNoPools')
                        : $t('campaign.pool.select.placeholder'),
                search: {
                    inputLabel: $t('campaign.pool.select.search.inputLabel'),
                    inputPlaceholder: $t(
                        'campaign.pool.select.search.inputPlaceholder',
                    ),
                    noPools: $t('campaign.pool.select.search.noPools'),
                },
            }"
        />
    </div>
</template>
<style>
.pool_picker__root {
    @apply p-3;
}
</style>
