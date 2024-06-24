import type { Meta, StoryObj } from "@storybook/vue3";

import MetModal from "../src/components/modal/MetModal.vue";
import MetTypography from "../src/components/typography/MetTypography.vue";
import { ref } from "vue";

const meta: Meta<typeof MetModal> = {
    component: MetModal,
    title: "Utils/Modal",
};

export default meta;

type Story = StoryObj<typeof MetModal>;

export const Standard: Story = {
    name: "Modal",
    render: () => ({
        setup() {
            const open = ref(false);

            const handleOnDismiss = () => {
                open.value = false;
            };

            return { args: { open, handleOnDismiss } };
        },
        components: { MetModal, MetTypography },
        template: `
            <MetModal :open="args.open.value" :onDismiss="args.handleOnDismiss">
                <MetTypography class="w-fit" @click="args.open.value = true">Click me</MetTypography>
                <template #modal>
                    <div className="bg-white dark:bg-black text-black dark:white-black p-3 rounded-xl">
                        <MetTypography>Hello world!</MetTypography>
                    </div>
                </template>
            </MetModal>
        `,
    }),
};
