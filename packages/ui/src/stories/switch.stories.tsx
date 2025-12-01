import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Switch } from "../components/switch";
import { SwitchOption } from "../components/switch/switch-option";
import { Typography } from "../components/typography";

const meta: Meta = {
    title: "Input/Switch",
    component: Switch,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

export const Base: Story = {
    render: (args) => {
        const [value, setValue] = useState(0);

        function handleOnChange(value: number) {
            setValue(value);
        }

        return (
            <Switch {...args} value={value} onChange={handleOnChange}>
                <SwitchOption value={0}>
                    <Typography weight="medium">First option</Typography>
                </SwitchOption>
                <SwitchOption value={1}>
                    <Typography weight="medium">Second option</Typography>
                </SwitchOption>
            </Switch>
        );
    },
};
