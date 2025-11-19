import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "storybook/preview-api";
import { type SelectOption } from "../components/select/index";
import { Typography } from "../components/typography";
import { MultiSelect } from "../components/multi-select";

const meta: Meta = {
    title: "Input/Multi select",
    component: MultiSelect,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        label: "Multi select",
        placeholder: "Placeholder",
        options: [
            { label: "First value", value: 1 },
            { label: "Second value", value: 2 },
            { label: "Third value", value: 3 },
        ],
        values: [],
        messages: {
            noResults: "No results",
        },
    },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Base: Story = {
    render: (args) => {
        const [values, setValues] = useState<SelectOption<number>[]>([]);

        function handleSelectOnChange(options: SelectOption<number>[]) {
            setValues(options);
        }

        return (
            <MultiSelect
                {...args}
                options={args.options as SelectOption<number>[]}
                values={values}
                onChange={handleSelectOnChange}
                className="w-60"
            />
        );
    },
};

export const CustomOption: Story = {
    render: (args) => {
        const [values, setValues] = useState<SelectOption<number>[]>([]);

        function handleSelectOnChange(options: SelectOption<number>[]) {
            setValues(options);
        }

        return (
            <MultiSelect
                {...args}
                options={args.options as SelectOption<number>[]}
                renderOption={(option) => (
                    <Typography weight="medium" size="sm" uppercase>
                        {option.label}
                    </Typography>
                )}
                values={values}
                onChange={handleSelectOnChange}
                className="w-60"
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
            <MultiSelect {...args} size="xs" />
            <MultiSelect {...args} size="sm" />
            <MultiSelect {...args} size="base" />
            <MultiSelect {...args} size="lg" />
        </div>
    ),
};
