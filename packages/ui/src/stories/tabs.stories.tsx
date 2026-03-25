import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "storybook/preview-api";
import { Tabs } from "../components/tabs/index";
import { Tab } from "../components/tabs/tab";
import { SettingsIcon } from "../assets";
import { UnderlinedTab } from "../components/tabs/underlined-tab";

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
            <div className="flex flex-col gap-4">
                <Tabs {...args} value={value} onChange={setValue}>
                    <Tab value={0} icon={SettingsIcon}>
                        First tab
                    </Tab>
                    <Tab value={1} icon={SettingsIcon}>
                        Second tab
                    </Tab>
                    <Tab value={2} icon={SettingsIcon}>
                        Third tab
                    </Tab>
                </Tabs>
                <Tabs {...args} value={value} onChange={setValue}>
                    <UnderlinedTab value={0} icon={SettingsIcon}>
                        First tab
                    </UnderlinedTab>
                    <UnderlinedTab value={1} icon={SettingsIcon}>
                        Second tab
                    </UnderlinedTab>
                    <UnderlinedTab value={2} icon={SettingsIcon}>
                        Third tab
                    </UnderlinedTab>
                </Tabs>
            </div>
        );
    },
};

export const Sizes: Story = {
    render: (args) => {
        const [value, setValue] = useState(0);

        return (
            <div className="flex flex-col gap-4">
                <Tabs {...args} value={value} onChange={setValue} size="xs">
                    <Tab value={0} icon={SettingsIcon}>
                        First tab
                    </Tab>
                    <Tab value={1} icon={SettingsIcon}>
                        Second tab
                    </Tab>
                    <Tab value={2} icon={SettingsIcon}>
                        Third tab
                    </Tab>
                </Tabs>
                <Tabs {...args} value={value} onChange={setValue} size="xs">
                    <Tab value={0} icon={SettingsIcon}>
                        First tab
                    </Tab>
                    <Tab value={1} icon={SettingsIcon}>
                        Second tab
                    </Tab>
                    <Tab value={2} icon={SettingsIcon}>
                        Third tab
                    </Tab>
                </Tabs>
                <Tabs {...args} value={value} onChange={setValue} size="sm">
                    <Tab value={0} icon={SettingsIcon}>
                        First tab
                    </Tab>
                    <Tab value={1} icon={SettingsIcon}>
                        Second tab
                    </Tab>
                    <Tab value={2} icon={SettingsIcon}>
                        Third tab
                    </Tab>
                </Tabs>
                <Tabs {...args} value={value} onChange={setValue} size="base">
                    <Tab value={0} icon={SettingsIcon}>
                        First tab
                    </Tab>
                    <Tab value={1} icon={SettingsIcon}>
                        Second tab
                    </Tab>
                    <Tab value={2} icon={SettingsIcon}>
                        Third tab
                    </Tab>
                </Tabs>
                <Tabs {...args} value={value} onChange={setValue} size="lg">
                    <Tab value={0} icon={SettingsIcon}>
                        First tab
                    </Tab>
                    <Tab value={1} icon={SettingsIcon}>
                        Second tab
                    </Tab>
                    <Tab value={2} icon={SettingsIcon}>
                        Third tab
                    </Tab>
                </Tabs>
                <Tabs {...args} value={value} onChange={setValue} size="xl">
                    <Tab value={0} icon={SettingsIcon}>
                        First tab
                    </Tab>
                    <Tab value={1} icon={SettingsIcon}>
                        Second tab
                    </Tab>
                    <Tab value={2} icon={SettingsIcon}>
                        Third tab
                    </Tab>
                </Tabs>
            </div>
        );
    },
};
