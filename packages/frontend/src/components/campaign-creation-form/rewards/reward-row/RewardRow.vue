<script setup lang="ts">
import MuiTokenSelect from "@/ui/token-select/MuiTokenSelect.vue";
import type { RewardRowProps } from "./types";
import MuiNumberInput from "@/ui/MuiNumberInput.vue";
import type { TokenInfo } from "@uniswap/token-lists";
import { ref, watch } from "vue";
import MuiRemoteLogo from "@/ui/remote-logo/MuiRemoteLogo.vue";
import RemoveXIcon from "@/icons/RemoveXIcon.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { useAttrs } from "vue";
import MuiTextField from "@/ui/text-field/MuiTextField.vue";

const props = defineProps<RewardRowProps>();
const tokenModel = defineModel<TokenInfo>("token");
const amountModel = defineModel<number>("amount");

const attrs = useAttrs();

const open = ref<boolean>();
const amountInputActive = ref(false);
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
                v-if="!tokenModel"
                v-model="tokenModel"
                :open="open"
                :error="tokenError"
                :tokens="$props.tokens"
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
            <div v-else class="reward_row__input__selected">
                <RemoveXIcon
                    class="reward_row__remove__icon"
                    @click="handleRewardOnTokenRemove"
                />
                <MuiRemoteLogo
                    :address="tokenModel.address"
                    lg
                    class="reward_row__logo__icon"
                />
                <MuiTypography>
                    {{ tokenModel.symbol }}
                </MuiTypography>
            </div>
        </div>
        <div class="reward_row__token__amount__input__wrapper">
            <MuiNumberInput
                v-if="!amountModel || amountInputActive"
                :placeholder="$t('campaign.rewards.amount')"
                class="reward_row__token__amount__input"
                v-model="amountModel"
                @focus="amountInputActive = true"
                @blur="amountInputActive = false"
                :error="amountError"
            />
            <div
                v-else
                class="reward_row__input__selected reward_row__amount__input__selected"
            >
                <RemoveXIcon
                    @click="amountModel = undefined"
                    class="reward_row__remove__amount__icon"
                />
                <MuiTextField
                    :label="$t('campaign.rewards.amount')"
                    :value="amountModel.toLocaleString()"
                    class="reward_row__token__amount__input"
                />
            </div>
        </div>
    </div>
</template>
<style>
.reward_row__root {
    @apply flex gap-2;
}

.reward_row__token__select__wrapper {
    @apply w-2/5;
}

.reward_row__token__amount__input__wrapper {
    @apply w-3/5;
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

.reward_row__input__selected:hover > .reward_row__remove__icon {
    @apply h-8 w-8 flex;
}

.reward_row__input__selected:hover > .reward_row__logo__icon {
    @apply hidden;
}

.reward_row__remove__icon {
    @apply w-8 h-8 hidden;
}

.reward_row__remove__amount__icon {
    @apply w-8 h-8 invisible;
}

.reward_row__amount__input__selected:hover > .reward_row__remove__amount__icon {
    @apply h-8 w-8 visible;
}
</style>
