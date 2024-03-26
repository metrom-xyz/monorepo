<script setup lang="ts">
import PairSelectIcon from "@/icons/PairSelectIcon.vue";
import MuiTextInput from "../MuiTextInput.vue";
import MuiModal from "../modal/MuiModal.vue";
import MuiPairSelectSearch from "./search/MuiPairSelectSearch.vue";
import type { Pair, PairSelectProps } from "./types";
import { computed } from "vue";

const props = defineProps<PairSelectProps>();
const emit = defineEmits<{
    dismiss: [];
    pairChange: [pair: Pair];
}>();

function handleModalOnDismiss() {
    emit("dismiss");
}

function handlePairOnChange(pair: Pair) {
    emit("pairChange", pair);
    emit("dismiss");
}

const inputValue = computed(() => {
    if (!props.selected) return;
    return `${props.selected.token0.symbol} / ${props.selected.token1.symbol}`;
});
</script>
<template>
    <div class="mui_pair_select__root" v-bind="{ ...$attrs }">
        <MuiModal :open="$props.open" :onDismiss="handleModalOnDismiss">
            <MuiTextInput
                iconLeft
                readonly
                :model-value="inputValue"
                :placeholder="$t('ui.pairSelect.placeholder')"
                class="mui_pair_select__root_input"
            >
                <template #icon>
                    <PairSelectIcon v-if="!$props.selected" />
                    <!-- TODO: add pair icon when selected -->
                    <!-- <MuiPairRemoteLogo
                        v-else
                        :token0="$props.selected.token0"
                        :token1="$props.selected.token1"
                    /> -->
                </template>
            </MuiTextInput>
            <template #modal>
                <MuiPairSelectSearch
                    :pairs="$props.pairs"
                    :label="$t('ui.pairSelect.placeholder')"
                    :selectedPair="$props.selected"
                    @dismiss="handleModalOnDismiss"
                    @pairChange="handlePairOnChange"
                />
            </template>
        </MuiModal>
    </div>
</template>
<style>
.mui_pair_select__root {
}

.mui_pair_select__root_input {
    @apply hover:cursor-pointer;
}
</style>
