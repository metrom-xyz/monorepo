import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorText } from "../components/error-text/index";

const meta: Meta = {
    title: "Data display/Error text",
    component: ErrorText,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: { children: "Metrom error text" },
} satisfies Meta<typeof ErrorText>;

export default meta;
type Story = StoryObj<typeof ErrorText>;

export const Base: Story = {};

export const Levels: Story = {
    render: (args) => {
        return (
            <div className="flex flex-col gap-4">
                <ErrorText {...args} level="warning" />
                <ErrorText {...args} level="error" />
            </div>
        );
    },
};

export const Sizes: Story = {
    render: (args) => {
        return (
            <div className="flex flex-col gap-4">
                <ErrorText {...args} size="xs" />
                <ErrorText {...args} size="sm" />
                <ErrorText {...args} size="base" />
                <ErrorText {...args} size="lg" />
                <ErrorText {...args} size="xl" />
                <ErrorText {...args} size="xl2" />
                <ErrorText {...args} size="xl4" />
                <ErrorText {...args} size="xl5" />
            </div>
        );
    },
};
