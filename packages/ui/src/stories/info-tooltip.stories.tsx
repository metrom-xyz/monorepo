import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoTooltip } from "../components/info-tooltip";
import { Typography } from "../components/typography";

const meta: Meta = {
    title: "Data display/Info tooltip",
    component: InfoTooltip,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: { children: "Metrom info tooltip" },
} satisfies Meta<typeof InfoTooltip>;

export default meta;
type Story = StoryObj<typeof InfoTooltip>;

export const Base: Story = {
    render: ({ children, ...args }) => {
        return (
            <InfoTooltip {...args}>
                <Typography size="sm">{children}</Typography>
            </InfoTooltip>
        );
    },
};
