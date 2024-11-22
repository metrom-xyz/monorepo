import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "../components/skeleton/index";

const meta: Meta = {
    title: "Feedback/Skeleton",
    component: Skeleton,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Base: Story = {
    render: (args) => {
        return (
            <div className="w-96">
                <Skeleton {...args} />
            </div>
        );
    },
};

export const Circular: Story = {
    render: (args) => {
        return (
            <div className="w-14">
                <Skeleton {...args} width={56} circular />
            </div>
        );
    },
};

export const Sizes: Story = {
    render: (args) => (
        <div className="w-96 flex flex-col gap-4">
            <Skeleton {...args} size="xs" />
            <Skeleton {...args} size="sm" />
            <Skeleton {...args} size="base" />
            <Skeleton {...args} size="lg" />
            <Skeleton {...args} size="xl" />
            <Skeleton {...args} size="xl2" />
            <Skeleton {...args} size="xl4" />
            <Skeleton {...args} size="xl5" />
        </div>
    ),
};
