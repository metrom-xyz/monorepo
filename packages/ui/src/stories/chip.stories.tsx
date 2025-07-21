import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "../components/chip/index";

const meta: Meta = {
    title: "Data display/Chip",
    component: Chip,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: { children: "Metrom chip" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof Chip>;

export const Base: Story = {};

export const Primary: Story = {
    args: {
        variant: "primary",
    },
};

export const Secondary: Story = {
    args: {
        variant: "secondary",
    },
};

export const Sizes: Story = {
    render: () => {
        return (
            <div className="flex flex-col gap-4">
                <Chip size="xs">Metrom chip</Chip>
                <Chip size="sm">Metrom chip</Chip>
            </div>
        );
    },
};
