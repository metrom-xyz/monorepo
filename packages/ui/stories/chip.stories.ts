import type { Meta, StoryObj } from "@storybook/vue3";

import MetChip from "../src/components/chip/MetChip.vue";

const meta: Meta<typeof MetChip> = {
    component: MetChip,
    title: "Data Display/Chip",
};

export default meta;

type Story = StoryObj<typeof MetChip>;

export const Chip: Story = {
    render: () => ({
        components: { MetChip },
        template: `
            <div class="flex flex-col gap-4">
                <MetChip sm>Small</MetChip>
                <MetChip lg>Large</MetChip>
                <MetChip clickable>Clickable</MetChip>
                <MetChip active>Active</MetChip>
            </div>
        `,
    }),
};
