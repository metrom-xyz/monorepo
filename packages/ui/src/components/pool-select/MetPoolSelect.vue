<script setup lang="ts">
import PoolSelectIcon from "../../icons/PoolSelectIcon.vue";
import MetTextInput from "../MetTextInput.vue";
import MetModal from "../modal/MetModal.vue";
import MetPoolSelectSearch from "./search/MetPoolSelectSearch.vue";
import type { PoolSelectProps } from "./types";
import { computed } from "vue";
import MetPairRemoteLogo from "../pair-remote-logo/MetPairRemoteLogo.vue";
import type { Pool } from "sdk";

defineProps<PoolSelectProps>();
const emit = defineEmits<{
    dismiss: [];
}>();
const selected = defineModel<Pool>();

function handleModalOnDismiss() {
    emit("dismiss");
}

function handlePoolOnChange(pool: Pool) {
    selected.value = pool;
    emit("dismiss");
}

const inputValue = computed(() => {
    if (!selected.value) return;
    return `${selected.value.token0.symbol} / ${selected.value.token1.symbol}`;
});
</script>
<template>
    <div class="met_pool_select__root" v-bind="{ ...$attrs }">
        <MetModal :open="$props.open" :onDismiss="handleModalOnDismiss">
            <MetTextInput
                iconLeft
                readonly
                :disabled="$attrs.disabled || $props.loading"
                :loading="$props.loading"
                :model-value="inputValue"
                :placeholder="$props.messages.inputPlaceholder"
                class="met_pool_select__input"
            >
                <template #icon>
                    <PoolSelectIcon v-if="!selected" />
                    <MetPairRemoteLogo
                        v-else
                        lg
                        :token0="selected.token0"
                        :token1="selected.token1"
                        class="met_pool_select__icon"
                    />
                </template>
            </MetTextInput>
            <template #modal>
                <MetPoolSelectSearch
                    :pools="$props.pools"
                    :selected="selected"
                    :baseTokens="$props.baseTokens"
                    @dismiss="handleModalOnDismiss"
                    @poolChange="handlePoolOnChange"
                    :messages="$props.messages.search"
                />
            </template>
        </MetModal>
    </div>
</template>
<style>
.met_pool_select__input {
    @apply hover:cursor-pointer;
}

.met_pool_select__icon {
    @apply w-12;
}

.met_pool_select__root
    > .met_base_input_wrapper__root
    > .met_base_input_wrapper__container__left_icon
    > input {
    @apply pl-[80px];
}

.met_pool_select__root
    > .met_base_input_wrapper__root
    > .met_base_input_wrapper__container__left_icon
    > .met_base_input_wrapper__icon__left {
    @apply left-4;
}
</style>
