import type { Meta, StoryObj } from "@storybook/vue3";

import MetSkeleton from "../src/components/skeleton/MetSkeleton.vue";

const meta: Meta<typeof MetSkeleton> = {
    component: MetSkeleton,
    title: "Skeleton",
};

export default meta;

type Story = StoryObj<typeof MetSkeleton>;

export const Skeleton: Story = {
    render: () => ({
        components: { MetSkeleton },
        template: `
            <div class="flex flex-col gap-2">
                <MetSkeleton xs :width="100" />
                <MetSkeleton sm :width="100" />
                <MetSkeleton :width="100" />
                <MetSkeleton lg :width="100" />
                <MetSkeleton xl :width="100" />
                <MetSkeleton h4 :width="100" />
                <MetSkeleton h3 :width="100" />
                <MetSkeleton h2 :width="100" />
                <MetSkeleton h1 :width="100" />
                <MetSkeleton circular :width="28" />
            </div>
        `,
    }),
};
