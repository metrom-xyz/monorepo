import type { Meta, StoryObj } from "@storybook/vue3";
import MetCard from "../src/components/MetCard.vue";
import MetTypography from "../src/components/typography/MetTypography.vue";
import MetChip from "../src/components/chip/MetChip.vue";

const meta: Meta<typeof MetCard> = {
    component: MetCard,
    title: "Data Display/Card",
};

export default meta;

type Story = StoryObj<typeof MetCard>;

export const Card: Story = {
    render: () => ({
        components: {
            MetCard,
            MetTypography,
            MetChip,
        },
        template: `
            <MetCard>
                <template #title>
                    <MetTypography uppercase>Card title</MetTypography>
                    <MetChip class="bg-green dark:bg-orange">
                        CUSTOM CHIP
                    </MetChip>
                </template>
                <template #content>
                    <div class="p-4">
                        <MetTypography>Just a modular and customizable card</MetTypography>
                        <div class="flex gap-2 mt-2">
                            <MetChip>UI</MetChip>
                            <MetChip>CARD</MetChip>
                            <MetChip>COMPONENT</MetChip>
                        </div>
                    </div>
                </template>
                <template #actions>
                    <MetTypography uppercase>Actions</MetTypography>
                </template>
            </MetCard>
        `,
    }),
};
