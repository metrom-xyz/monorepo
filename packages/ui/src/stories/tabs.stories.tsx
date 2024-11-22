import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "@storybook/preview-api";
import { Tabs } from "../components/tabs/index";
import { Tab } from "../components/tabs/tab";

const meta: Meta = {
    title: "Input/Tabs",
    component: Tabs,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Base: Story = {
    render: (args) => {
        const [value, setValue] = useState(0);

        return (
            <div className="w-96">
                <Tabs {...args} value={value} onChange={setValue}>
                    <Tab value={0}>First tab</Tab>
                    <Tab value={1}>Second tab</Tab>
                    <Tab value={2}>Third tab</Tab>
                </Tabs>
            </div>
        );
    },
};
