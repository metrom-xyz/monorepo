import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "../components/button/index";
import { SettingsIcon } from "../assets/settings";

const meta: Meta = {
    title: "Input/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: { onClick: fn(), children: "Metrom button" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

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
            <Button {...args} icon={SettingsIcon} size="xs" />
            <Button {...args} icon={SettingsIcon} size="sm" />
            <Button {...args} icon={SettingsIcon} size="lg" />
        </div>
    ),
};
