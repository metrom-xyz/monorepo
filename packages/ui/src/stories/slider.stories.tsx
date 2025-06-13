import type { Meta, StoryObj } from "@storybook/react-vite";
import { SliderInput } from "../components/slider/index";
import { useState } from "storybook/preview-api";
import type { ChangeEvent } from "react";

const meta: Meta = {
    title: "Input/Slider",
    component: SliderInput,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <div className="w-full sm:w-96">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        min: {
            type: "number",
        },
        max: {
            type: "number",
        },
    },
    tags: ["autodocs"],
} satisfies Meta<typeof SliderInput>;

export default meta;
type Story = StoryObj<typeof SliderInput>;

export const Base: Story = {
    render: (args) => {
        const [value, setValue] = useState(0);

        function handleValueOnChange(event: ChangeEvent<HTMLInputElement>) {
            setValue(Number(event.target.value));
        }

        return (
            <SliderInput
                {...args}
                value={value}
                max={args.max || 80}
                formattedValue={`${((value / Number(100)) * 100).toFixed(0)}%`}
                onChange={handleValueOnChange}
            />
        );
    },
};

export const Loading: Story = {
    args: {
        loading: true,
    },
};

export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <SliderInput {...args} size="xs" />
            <SliderInput {...args} size="sm" />
            <SliderInput {...args} size="base" />
            <SliderInput {...args} size="lg" />
        </div>
    ),
};

export const Error: Story = {
    args: {
        error: true,
        errorText: "Error message",
    },
};
