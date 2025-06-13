import type { Meta, StoryObj } from "@storybook/react-vite";
import { PoolRemoteLogo } from "../components/pool-remote-logo/index";

const fallbackTokens = [
    { defaultText: "usdc" },
    { defaultText: "wbtc" },
    { defaultText: "dai" },
];

const meta: Meta = {
    title: "Data display/Pool remote logo",
    component: PoolRemoteLogo,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        tokens: [
            {
                src: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png",
            },
            {
                src: "https://assets.coingecko.com/coins/images/7598/standard/wrapped_bitcoin_wbtc.png",
            },
            {
                src: "https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png",
            },
        ],
    },
} satisfies Meta<typeof PoolRemoteLogo>;

export default meta;
type Story = StoryObj<typeof PoolRemoteLogo>;

export const Base: Story = {};

export const Loading: Story = {
    args: {
        loading: true,
    },
};

export const Sizes: Story = {
    render: (args) => {
        return (
            <div className="flex gap-12">
                <div className="flex flex-col gap-4">
                    <PoolRemoteLogo {...args} size="xs" />
                    <PoolRemoteLogo {...args} size="sm" />
                    <PoolRemoteLogo {...args} size="base" />
                    <PoolRemoteLogo {...args} size="lg" />
                    <PoolRemoteLogo {...args} size="xl" />
                </div>
                <div className="flex flex-col gap-4">
                    <PoolRemoteLogo
                        {...args}
                        tokens={fallbackTokens}
                        size="xs"
                    />
                    <PoolRemoteLogo
                        {...args}
                        tokens={fallbackTokens}
                        size="sm"
                    />
                    <PoolRemoteLogo
                        {...args}
                        tokens={fallbackTokens}
                        size="base"
                    />
                    <PoolRemoteLogo
                        {...args}
                        tokens={fallbackTokens}
                        size="lg"
                    />
                    <PoolRemoteLogo
                        {...args}
                        tokens={fallbackTokens}
                        size="xl"
                    />
                </div>
            </div>
        );
    },
};
