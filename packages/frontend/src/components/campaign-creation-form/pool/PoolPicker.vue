<script setup lang="ts">
import { MetPoolSelect } from "@metrom-xyz/ui";
import { computed, ref } from "vue";
import type { PoolPickerTypes } from "./types";
import { watchEffect } from "vue";
import { usePools } from "@/composables/usePools";
import { CHAIN_DATA } from "@/commons";
import type { SupportedChain } from "@metrom-xyz/sdk";

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
        <MetPoolSelect
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
                    label: $t('campaign.pool.select.search.label'),
                    placeholder: $t('campaign.pool.select.search.placeholder'),
                    noPools: $t('campaign.pool.select.search.noPools'),
                    pool: $t('campaign.pool.select.search.pool'),
                    tvl: $t('campaign.pool.select.search.tvl'),
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
