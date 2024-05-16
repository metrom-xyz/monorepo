<script setup lang="ts">
import PoolSelectIcon from "@/icons/PoolSelectIcon.vue";
import MuiTextInput from "../MuiTextInput.vue";
import MuiModal from "../modal/MuiModal.vue";
import MuiPoolSelectSearch from "./search/MuiPoolSelectSearch.vue";
import type { PoolSelectProps } from "./types";
import { computed } from "vue";
import MuiPairRemoteLogo from "../pair-remote-logo/MuiPairRemoteLogo.vue";
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
    <div class="mui_pool_select__root" v-bind="{ ...$attrs }">
        <MuiModal :open="$props.open" :onDismiss="handleModalOnDismiss">
            <MuiTextInput
                iconLeft
                readonly
                :disabled="$attrs.disabled || $props.loading"
                :loading="$props.loading"
                :model-value="inputValue"
                :placeholder="$props.messages.inputPlaceholder"
                class="mui_pool_select__input"
            >
                <template #icon>
                    <PoolSelectIcon v-if="!selected" />
                    <MuiPairRemoteLogo
                        v-else
                        lg
                        :token0="selected.token0"
                        :token1="selected.token1"
                        class="mui_pool_select__icon"
                    />
                </template>
            </MuiTextInput>
            <template #modal>
                <MuiPoolSelectSearch
                    :pools="$props.pools"
                    :selected="selected"
                    @dismiss="handleModalOnDismiss"
                    @poolChange="handlePoolOnChange"
                    :messages="$props.messages.search"
                />
            </template>
        </MuiModal>
    </div>
</template>
<style>
.mui_pool_select__input {
    @apply hover:cursor-pointer;
}

.mui_pool_select__icon {
    @apply w-12;
}

.mui_pool_select__root
    > .mui_base_input_wrapper__root
    > .mui_base_input_wrapper__container__left_icon
    > input {
    @apply pl-[80px];
}

.mui_pool_select__root
    > .mui_base_input_wrapper__root
    > .mui_base_input_wrapper__container__left_icon
    > .mui_base_input_wrapper__icon__left {
    @apply left-4;
}
</style>
