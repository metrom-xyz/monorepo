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
        <div className="flex gap-8">
            <div className="flex flex-col gap-4">
                <Button {...args} icon={SettingsIcon} size="xs" />
                <Button {...args} icon={SettingsIcon} size="sm" />
                <Button {...args} icon={SettingsIcon} size="base" />
                <Button {...args} icon={SettingsIcon} size="lg" />
            </div>
            <div className="flex flex-col gap-4">
                <Button
                    {...args}
                    icon={SettingsIcon}
                    variant="secondary"
                    size="xs"
                />
                <Button
                    {...args}
                    icon={SettingsIcon}
                    variant="secondary"
                    size="sm"
                />
                <Button
                    {...args}
                    icon={SettingsIcon}
                    variant="secondary"
                    size="base"
                />
                <Button
                    {...args}
                    icon={SettingsIcon}
                    variant="secondary"
                    size="lg"
                />
            </div>
        </div>
    ),
};

export const Links: Story = {
    render: () => (
        <div className="flex gap-8">
            <div className="flex flex-col gap-4">
                <Button
                    href="https://app.metrom.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="xs"
                >
                    Metrom link
                </Button>
                <Button
                    href="https://app.metrom.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                >
                    Metrom link
                </Button>
                <Button
                    href="https://app.metrom.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="base"
                >
                    Metrom link
                </Button>
                <Button
                    href="https://app.metrom.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                >
                    Metrom link
                </Button>
            </div>
            <div className="flex flex-col gap-4">
                <Button
                    href="https://app.metrom.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="xs"
                >
                    Metrom link
                </Button>
                <Button
                    href="https://app.metrom.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="sm"
                >
                    Metrom link
                </Button>
                <Button
                    href="https://app.metrom.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="base"
                >
                    Metrom link
                </Button>
                <Button
                    href="https://app.metrom.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="lg"
                >
                    Metrom link
                </Button>
            </div>
        </div>
    ),
};
