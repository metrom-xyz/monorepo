import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "../components/toggle/index";
import { useState } from "react";

const meta: Meta = {
    title: "Input/Toggle",
    component: Toggle,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Base: Story = {
    render: (args) => {
        const [checked, setChecked] = useState(false);

        function handleOnClick() {
            setChecked((prev) => !prev);
        }

        return <Toggle {...args} checked={checked} onClick={handleOnClick} />;
    },
};
