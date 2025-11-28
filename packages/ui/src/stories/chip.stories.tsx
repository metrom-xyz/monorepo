import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
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

export const Primary: Story = {
    render: (args) => {
        return (
            <div className="flex flex-col gap-4">
                <Chip {...args} variant="primary">
                    Metrom chip
                </Chip>
            </div>
        );
    },
};

export const Secondary: Story = {
    render: (args) => {
        return (
            <div className="flex flex-col gap-4">
                <Chip {...args} variant="secondary">
                    Metrom chip
                </Chip>
            </div>
        );
    },
};

export const WithOnClick: Story = {
    args: {
        onClick: fn(),
    },
};

export const WithOnClose: Story = {
    args: {
        onClose: fn(),
    },
};

export const Sizes: Story = {
    render: () => {
        return (
            <div className="w-full flex flex-col gap-4 items-start">
                <Chip size="xs">Metrom chip</Chip>
                <Chip size="sm">Metrom chip</Chip>
                <Chip size="sm" onClose={() => {}}>
                    Metrom chip
                </Chip>
            </div>
        );
    },
};
