<script setup lang="ts">
import PlusCircleIcon from "@/icons/PlusCircleIcon.vue";
import RestrictionsIcon from "@/icons/RestrictionsIcon.vue";
import XIcon from "@/icons/XIcon.vue";
import type { CampaignState } from "@/types";
import MuiButton from "@/ui/button/MuiButton.vue";
import MuiListInput from "@/ui/list-input/MuiListInput.vue";
import type { ItemType } from "@/ui/list-input/types";
import type { ListItem } from "@/ui/list-input/types";
import MuiModal from "@/ui/modal/MuiModal.vue";
import MuiTabs from "@/ui/tabs/MuiTabs.vue";
import MuiTab from "@/ui/tabs/tab/MuiTab.vue";
import MuiTypography from "@/ui/typography/MuiTypography.vue";
import { isAddress, type Address } from "viem";
import { watch } from "vue";
import { ref } from "vue";
import RestrictionRow from "./row/RestrictionRow.vue";

const model = defineModel<CampaignState["restrictions"]>();

const open = ref(false);
const listType = ref(0);
const restrictions = ref<ListItem<Address>[]>([]);

// sync the internal restricted addresses and the active tab
// with the model value when the modal closes
watch(open, (previous, current) => {
    if (previous === true && current === false) {
        restrictions.value =
            model.value?.list.map((address) => ({
                label: address,
                value: address,
            })) || [];
        listType.value = model.value?.type === "blacklist" ? 1 : 0;
    }
});

function handleModalOnDismiss() {
    open.value = false;
}

function handleListTypeOnChange(value: number | undefined) {
    if (value === undefined) return;
    listType.value = value;
}

function handleAddAddress(addresses: ListItem<Address>[]) {
    restrictions.value = addresses;
}

function validateAddress(address: ItemType) {
    return isAddress(address as string);
}

function handleApplyOnClick() {
    if (restrictions.value.length === 0) model.value = undefined;
    else
        model.value = {
            type: listType.value === 0 ? "whitelist" : "blacklist",
            list: restrictions.value.map((item) => item.value),
        };
    open.value = false;
}
</script>
<template>
    <div class="restrictions_picker__root">
        <MuiModal :onDismiss="handleModalOnDismiss" :open="open">
            <button @click="open = true" class="restrictions_picker__button">
                <div
                    v-if="!model || model.list.length === 0"
                    class="restrictions_picker__button__content"
                >
                    <PlusCircleIcon class="restrictions_picker__button__icon" />
                    <MuiTypography sm medium>
                        {{ $t("campaign.restrictions.add") }}
                    </MuiTypography>
                </div>
                <div v-else class="restrictions_picker__button__content">
                    <RestrictionsIcon
                        class="restrictions_picker__button__icon"
                    />
                    <MuiTypography sm medium>
                        {{
                            $t("campaign.restrictions.amount", {
                                amount: model.list.length,
                            })
                        }}
                    </MuiTypography>
                </div>
            </button>
            <template #modal>
                <div class="restrictions_picker__modal__container">
                    <XIcon
                        @click="handleModalOnDismiss"
                        class="restrictions_picker__modal__close__icon"
                    />
                    <MuiTypography>
                        {{ $t("campaign.restrictions.overview") }}
                    </MuiTypography>
                    <MuiTabs @change="handleListTypeOnChange" :value="listType">
                        <MuiTab>
                            <div class="restrictions_picker__tab__content">
                                <div
                                    class="restrictions_picker__dot restrictions_picker__dot__green"
                                ></div>
                                <MuiTypography medium>
                                    {{ $t("campaign.restrictions.whitelist") }}
                                </MuiTypography>
                            </div>
                        </MuiTab>
                        <MuiTab>
                            <div class="restrictions_picker__tab__content">
                                <div
                                    class="restrictions_picker__dot restrictions_picker__dot__red"
                                ></div>
                                <MuiTypography medium>
                                    {{ $t("campaign.restrictions.blacklist") }}
                                </MuiTypography>
                            </div>
                        </MuiTab>
                    </MuiTabs>
                    <MuiListInput
                        :max="20"
                        :items="restrictions"
                        @change="handleAddAddress"
                        :validate="validateAddress"
                        :messages="{
                            placeholder: $t(
                                'campaign.restrictions.input.placeholder',
                            ),
                            button: $t('campaign.restrictions.input.button'),
                        }"
                    >
                        <template #item="{ item, onRemove }">
                            <RestrictionRow
                                :address="item.value"
                                :onRemove="onRemove"
                            />
                        </template>
                    </MuiListInput>
                    <div class="restrictions_picker__footer">
                        <MuiButton
                            @click="handleApplyOnClick"
                            fill
                            :disabled="
                                restrictions.length === 0 &&
                                (!model || model.list.length === 0)
                            "
                            secondary
                        >
                            {{ $t("campaign.restrictions.apply") }}
                        </MuiButton>
                    </div>
                </div>
            </template>
        </MuiModal>
    </div>
</template>
<style>
.restrictions_picker__root {
}

.restrictions_picker__button {
    @apply w-full p-1.5 rounded-xl border border-gray-400 bg-gray-100;
}

.restrictions_picker__button__content {
    @apply flex gap-1 justify-between items-center;
}

.restrictions_picker__button__icon {
    @apply h-5 w-5;
}

.restrictions_picker__modal__container {
    @apply flex flex-col gap-4 bg-white px-8 py-5 max-w-[414px] rounded-[30px] border-2 border-green;
}

.restrictions_picker__modal__close__icon {
    @apply self-end hover:cursor-pointer;
}

.restrictions_picker__tab__content {
    @apply flex justify-center gap-2;
}

.restrictions_picker__dot {
    @apply h-5 w-5 rounded-full;
}

.restrictions_picker__dot__green {
    @apply bg-green;
}

.restrictions_picker__dot__red {
    @apply bg-red-light;
}

.restrictions_picker__footer {
    @apply w-full;
}
</style>
