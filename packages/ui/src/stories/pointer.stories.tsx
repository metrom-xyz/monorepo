import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pointer } from "../components/pointer";

const meta: Meta = {
    title: "Surfaces/Pointer",
    component: Pointer,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        text: "Pointer text",
    },
} satisfies Meta<typeof Pointer>;

export default meta;
type Story = StoryObj<typeof Pointer>;

export const Base: Story = {};

export const Sizes: Story = {
    render: () => {
        return (
            <div className="flex gap-8">
                <div className="flex flex-col gap-4">
                    <Pointer text="Pointer text" size="xs" />
                    <Pointer text="Pointer text" size="sm" />
                    <Pointer text="Pointer text" size="base" />
                    <Pointer text="Pointer text" size="lg" />
                </div>
                <div className="flex flex-col gap-4">
                    <Pointer text="Pointer text" size="xs" anchor="top" />
                    <Pointer text="Pointer text" size="sm" anchor="top" />
                    <Pointer text="Pointer text" size="base" anchor="top" />
                    <Pointer text="Pointer text" size="lg" anchor="top" />
                </div>
                <div className="flex flex-col gap-4">
                    <Pointer text="Pointer text" size="xs" anchor="right" />
                    <Pointer text="Pointer text" size="sm" anchor="right" />
                    <Pointer text="Pointer text" size="base" anchor="right" />
                    <Pointer text="Pointer text" size="lg" anchor="right" />
                </div>
                <div className="flex flex-col gap-4">
                    <Pointer text="Pointer text" size="xs" anchor="bottom" />
                    <Pointer text="Pointer text" size="sm" anchor="bottom" />
                    <Pointer text="Pointer text" size="base" anchor="bottom" />
                    <Pointer text="Pointer text" size="lg" anchor="bottom" />
                </div>
            </div>
        );
    },
};

export const Variants: Story = {
    render: () => {
        return (
            <div className="flex flex-col gap-4">
                <Pointer text="Pointer text" color="blue" />
                <Pointer text="Pointer text" color="green" />
                <Pointer text="Pointer text" color="red" />
            </div>
        );
    },
};
