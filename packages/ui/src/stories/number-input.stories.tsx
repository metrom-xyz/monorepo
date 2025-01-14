import type { Meta, StoryObj } from "@storybook/react";
import { NumberInput } from "../components/number-input";
import { SettingsIcon } from "../assets/settings";

const meta: Meta = {
    title: "Input/Number",
    component: NumberInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: { label: "Number input", placeholder: "Placeholder" },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Base: Story = {};

export const WithIcon: Story = {
    args: {
        icon: SettingsIcon,
        iconPlacement: "left",
    },
};

export const Loading: Story = {
    args: {
        loading: true,
    },
};

export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <NumberInput {...args} size="xs" />
            <NumberInput {...args} size="sm" />
            <NumberInput {...args} size="base" />
            <NumberInput {...args} size="lg" />
        </div>
    ),
};

export const Error: Story = {
    args: {
        error: true,
        errorText: "Error message",
    },
};
