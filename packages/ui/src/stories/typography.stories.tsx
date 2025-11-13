import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "../components/typography/index";

const meta: Meta = {
    title: "Data display/Typography",
    component: Typography,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof Typography>;

export const Base: Story = {
    args: {
        children: "Metrom typography",
    },
};

export const Sizes: Story = {
    render: (args) => (
        <div className="flex gap-8">
            <div className="flex flex-col gap-4">
                <Typography {...args} size="xs">
                    Metrom typography xs
                </Typography>
                <Typography {...args} size="sm">
                    Metrom typography sm
                </Typography>
                <Typography {...args} size="base">
                    Metrom typography base
                </Typography>
                <Typography {...args} size="lg">
                    Metrom typography lg
                </Typography>
                <Typography {...args} size="xl">
                    Metrom typography xl
                </Typography>
                <Typography {...args} size="xl2">
                    Metrom typography xl2
                </Typography>
                <Typography {...args} size="xl3">
                    Metrom typography xl3
                </Typography>
                <Typography {...args} size="xl4">
                    Metrom typography xl4
                </Typography>
            </div>
            <div className="flex flex-col gap-4">
                <Typography {...args} uppercase size="xs">
                    Metrom typography xs
                </Typography>
                <Typography {...args} uppercase size="sm">
                    Metrom typography sm
                </Typography>
                <Typography {...args} uppercase size="base">
                    Metrom typography base
                </Typography>
                <Typography {...args} uppercase size="lg">
                    Metrom typography lg
                </Typography>
                <Typography {...args} uppercase size="xl">
                    Metrom typography xl
                </Typography>
                <Typography {...args} uppercase size="xl2">
                    Metrom typography xl2
                </Typography>
                <Typography {...args} uppercase size="xl3">
                    Metrom typography xl3
                </Typography>
                <Typography {...args} uppercase size="xl4">
                    Metrom typography xl4
                </Typography>
            </div>
        </div>
    ),
};
