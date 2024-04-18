<script setup lang="ts">
import MuiTokenSelect from "@/ui/token-select/MuiTokenSelect.vue";
import type { RewardRowProps } from "./types";
import MuiNumberInput from "@/ui/MuiNumberInput.vue";
import type { TokenInfo } from "@uniswap/token-lists";
import { ref, watch } from "vue";
import RemoveXIcon from "@/icons/RemoveXIcon.vue";
import { useAttrs } from "vue";

const props = defineProps<RewardRowProps>();
const tokenModel = defineModel<TokenInfo>("token");
const amountModel = defineModel<number>("amount");

const attrs = useAttrs();

const open = ref<boolean>();
const tokenError = ref(false);
const amountError = ref(false);

watch(
    tokenModel,
    () => {
        tokenError.value = !tokenModel.value;
    },
    { immediate: false },
);

watch(
    amountModel,
    () => {
        amountError.value = !amountModel.value;
    },
    { immediate: false },
);

function handleRewardOnTokenRemove() {
    if (!props.onRemove || attrs.index === undefined) return;
    props.onRemove(attrs.index as number);
}
</script>
<template>
    <div class="reward_row__root">
        <div class="reward_row__token__select__wrapper">
            <MuiTokenSelect
                v-model="tokenModel"
                :open="open"
                :error="tokenError"
                :messages="{
                    inputPlaceholder: $t('campaign.rewards.select.placeholder'),
                    search: {
                        inputLabel: $t(
                            'campaign.rewards.select.search.inputLabel',
                        ),
                        inputPlaceholder: $t(
                            'campaign.rewards.select.search.inputPlaceholder',
                        ),
                        noTokens: $t('campaign.rewards.select.search.noTokens'),
                    },
                }"
                :optionDisabled="
                    (token) =>
                        !!$props.rewards.find(
                            (reward) => reward.token?.address === token.address,
                        )
                "
                @dismiss="open = undefined"
                @click="open = true"
            />
        </div>
        <div class="reward_row__token__amount__input__wrapper">
            <MuiNumberInput
                :placeholder="$t('campaign.rewards.amount')"
                class="reward_row__token__amount__input"
                v-model="amountModel"
                :error="amountError"
            />
        </div>
        <RemoveXIcon
            class="reward_row__remove__icon"
            :class="{
                reward_row__remove__icon_hidden:
                    $props.rewards.length === 1 && $attrs.index === 0,
            }"
            @click="handleRewardOnTokenRemove"
        />
    </div>
</template>
<style>
.reward_row__root {
    @apply flex gap-2 items-center;
}

.reward_row__token__select__wrapper {
    @apply w-2/5;
}

.reward_row__token__amount__input__wrapper {
    @apply w-3/5;
}

.reward_row__remove__icon {
    @apply w-10 h-10 hover:cursor-pointer;
}

.reward_row__remove__icon_hidden {
    @apply hidden;
}

.reward_row__token__amount__input {
    @apply text-right;
}

.reward_row__input__selected {
    @apply flex
        gap-2
        items-center
        h-[60px]
        p-4
        border-2
        rounded-xxl
        border-transparent
        bg-gray-100
        hover:cursor-pointer;
}

.reward_row__amount__input__selected {
    @apply justify-between;
}
</style>
