import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "../components/text-input";
import { SettingsIcon } from "../assets/settings";
import { Typography } from "../components/typography";

const meta: Meta = {
    title: "Input/Text",
    component: TextInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: { label: "Text input", placeholder: "Placeholder" },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Base: Story = {};

export const WithIcon: Story = {
    args: {
        icon: SettingsIcon,
        iconPlacement: "left",
    },
};

export const WithPrefixElement: Story = {
    args: {
        prefixElement: <Typography>Prefix</Typography>,
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
            <TextInput {...args} size="xs" />
            <TextInput {...args} size="sm" />
            <TextInput {...args} size="base" />
            <TextInput {...args} size="lg" />
        </div>
    ),
};

export const Error: Story = {
    args: {
        error: true,
        errorText: "Error message",
    },
};
