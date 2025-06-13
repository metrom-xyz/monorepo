import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "../components/switch/index";

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

export const Base: Story = {};
