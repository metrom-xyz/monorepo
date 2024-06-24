import type { Meta, StoryObj } from "@storybook/vue3";

import MetPopover from "../src/components/popover/MetPopover.vue";
import MetTypography from "../src/components/typography/MetTypography.vue";
import { ref } from "vue";

const meta: Meta<typeof MetPopover> = {
    component: MetPopover,
    title: "Utils/Popover",
};

export default meta;

type Story = StoryObj<typeof MetPopover>;

export const Popover: Story = {
    render: () => ({
        setup() {
            const open = ref(false);

            const handleOnMouseEnter = () => {
                open.value = true;
            };
            const handleOnMouseLeave = () => {
                open.value = false;
            };

            return { args: { open, handleOnMouseEnter, handleOnMouseLeave } };
        },
        components: { MetPopover, MetTypography },
        template: `
            <MetPopover :open="args.open.value">
                <MetTypography
                    @mouseenter="args.handleOnMouseEnter"
                    @mouseleave="args.handleOnMouseLeave"
                    class="w-fit"
                >
                    Hover me
                </MetTypography>
                <template #popover>
                    <MetTypography class="px-3 py-2">Hello world!</MetTypography>
                </template>
            </MetPopover>
        `,
    }),
};
