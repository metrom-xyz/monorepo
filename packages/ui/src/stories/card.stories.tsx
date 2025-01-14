import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "../components/card/index";
import { Typography } from "../components/typography";
import { TextInput } from "../components/text-input";

const meta: Meta = {
    title: "Data display/Card",
    component: Card,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "Gray",
        },
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

export const Base: Story = {
    render: (args) => {
        return (
            <div className="w-96 h-96 flex items-center justify-between">
                <Card {...args}>
                    <div className="flex flex-col gap-4">
                        <Typography uppercase>
                            My custom card content
                        </Typography>
                        <TextInput
                            label="Text input"
                            placeholder="Placeholder"
                        />
                    </div>
                </Card>
            </div>
        );
    },
};
