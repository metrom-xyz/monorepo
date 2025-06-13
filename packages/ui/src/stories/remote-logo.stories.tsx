import type { Meta, StoryObj } from "@storybook/react-vite";
import { RemoteLogo } from "../components/remote-logo/index";

const meta: Meta = {
    title: "Data display/Remote logo",
    component: RemoteLogo,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        src: "https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png",
    },
} satisfies Meta<typeof RemoteLogo>;

export default meta;
type Story = StoryObj<typeof RemoteLogo>;

export const Base: Story = {};

export const Loading: Story = {
    args: {
        loading: true,
    },
};

export const Sizes: Story = {
    render: (args) => {
        return (
            <div className="flex gap-8">
                <div className="flex flex-col gap-4">
                    <RemoteLogo {...args} size="xs" />
                    <RemoteLogo {...args} size="sm" />
                    <RemoteLogo {...args} size="base" />
                    <RemoteLogo {...args} size="lg" />
                    <RemoteLogo {...args} size="xl" />
                </div>
                <div className="flex flex-col gap-4">
                    <RemoteLogo {...args} src="" size="xs" />
                    <RemoteLogo {...args} src="" size="sm" />
                    <RemoteLogo {...args} src="" size="base" />
                    <RemoteLogo {...args} src="" size="lg" />
                    <RemoteLogo {...args} src="" size="xl" />
                </div>
            </div>
        );
    },
};
