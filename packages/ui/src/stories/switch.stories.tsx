import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "../components/switch/index";
import { useState } from "react";

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
        const [checked, setChecked] = useState(false);

        function handleOnClick() {
            setChecked((prev) => !prev);
        }

        return <Switch {...args} checked={checked} onClick={handleOnClick} />;
    },
};
