import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "@storybook/preview-api";
import { Select, type SelectOption } from "../components/select/index";
import { Typography } from "../components/typography";

const meta: Meta = {
    title: "Input/Select",
    component: Select,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        label: "Select",
        placeholder: "Placeholder",
        options: [
            { label: "First value", value: 1 },
            { label: "Second value", value: 2 },
            { label: "Third value", value: 3 },
        ],
        messages: {
            noResults: "No results",
        },
    },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

export const Base: Story = {
    render: (args) => {
        const [value, setValue] = useState<number>(0);

        function handleSelectOnChange(option: SelectOption<number>) {
            setValue(option.value);
        }

        return (
            <Select
                {...args}
                options={args.options as SelectOption<number>[]}
                value={value}
                onChange={handleSelectOnChange}
            />
        );
    },
};

export const CustomOption: Story = {
    render: (args) => {
        const [value, setValue] = useState<number>(0);

        function handleSelectOnChange(option: SelectOption<number>) {
            setValue(option.value);
        }

        return (
            <Select
                {...args}
                options={args.options as SelectOption<number>[]}
                renderOption={(option) => (
                    <Typography weight="medium" size="sm" uppercase>
                        {option.label}
                    </Typography>
                )}
                value={value}
                onChange={handleSelectOnChange}
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
            <Select {...args} size="xs" />
            <Select {...args} size="sm" />
            <Select {...args} size="base" />
            <Select {...args} size="lg" />
        </div>
    ),
};
