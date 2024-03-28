<script setup lang="ts">
import PairSelectIcon from "@/icons/PairSelectIcon.vue";
import MuiTextInput from "../MuiTextInput.vue";
import MuiModal from "../modal/MuiModal.vue";
import MuiPairSelectSearch from "./search/MuiPairSelectSearch.vue";
import type { Pair, PairSelectProps } from "./types";
import { computed } from "vue";

defineProps<PairSelectProps>();
const emit = defineEmits<{
    dismiss: [];
}>();
const selected = defineModel<Pair>();

function handleModalOnDismiss() {
    emit("dismiss");
}

function handlePairOnChange(pair: Pair) {
    selected.value = pair;
    emit("dismiss");
}

const inputValue = computed(() => {
    if (!selected.value) return;
    return `${selected.value.token0.symbol} / ${selected.value.token1.symbol}`;
});
</script>
<template>
    <div class="mui_pair_select__root" v-bind="{ ...$attrs }">
        <MuiModal :open="$props.open" :onDismiss="handleModalOnDismiss">
            <MuiTextInput
                iconLeft
                readonly
                :model-value="inputValue"
                :placeholder="$props.messages.inputPlaceholder"
                class="mui_pair_select__input"
            >
                <template #icon>
                    <PairSelectIcon v-if="!selected" />
                    <!-- TODO: add pair icon when selected -->
                    <!-- TODO: add messages prop -->
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
                    :selected="selected"
                    @dismiss="handleModalOnDismiss"
                    @pairChange="handlePairOnChange"
                    :messages="$props.messages.search"
                />
            </template>
        </MuiModal>
    </div>
</template>
<style>
.mui_pair_select__root {
}

.mui_pair_select__input {
    @apply hover:cursor-pointer;
}
</style>
