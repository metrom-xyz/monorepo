import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "storybook/preview-api";
import { Tabs } from "../components/tabs/index";
import { Tab } from "../components/tabs/tab";
import { Typography } from "../components/typography";
import { SettingsIcon } from "../assets";

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
                    <Tab value={0} icon={SettingsIcon}>
                        <Typography>First tab</Typography>
                    </Tab>
                    <Tab value={1} icon={SettingsIcon}>
                        <Typography>Second tab</Typography>
                    </Tab>
                    <Tab value={2} icon={SettingsIcon}>
                        <Typography>Third tab</Typography>
                    </Tab>
                </Tabs>
            </div>
        );
    },
};
