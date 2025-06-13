import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "../components/text-field/index";

const meta: Meta = {
    title: "Data display/Text field",
    component: TextField,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "Gray",
        },
    },
    tags: ["autodocs"],
    args: { label: "Text field" },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof TextField>;

export const Base: Story = {
    args: {
        value: "Metrom text field",
    },
};

export const Loading: Story = { args: { loading: true } };

export const Boxed: Story = {
    args: { boxed: true, value: "Metrom boxed text field" },
};

export const Sizes: Story = {
    render: (args) => (
        <div className="flex gap-8">
            <div className="flex flex-col gap-4">
                <TextField {...args} size="xs" value="Metrom text field xs" />
                <TextField {...args} size="sm" value="Metrom text field sm" />
                <TextField
                    {...args}
                    size="base"
                    value="Metrom text field base"
                />
                <TextField {...args} size="lg" value="Metrom text field lg" />
                <TextField {...args} size="xl" value="Metrom text field xl" />
                <TextField {...args} size="xl2" value="Metrom text field xl2" />
                <TextField {...args} size="xl4" value="Metrom text field xl4" />
                <TextField {...args} size="xl5" value="Metrom text field xl5" />
            </div>
            <div className="flex flex-col gap-4">
                <TextField
                    {...args}
                    boxed
                    size="xs"
                    value="Metrom text field xs"
                />
                <TextField
                    {...args}
                    boxed
                    size="sm"
                    value="Metrom text field sm"
                />
                <TextField
                    {...args}
                    boxed
                    size="base"
                    value="Metrom text field base"
                />
                <TextField
                    {...args}
                    boxed
                    size="lg"
                    value="Metrom text field lg"
                />
                <TextField
                    {...args}
                    boxed
                    size="xl"
                    value="Metrom text field xl"
                />
                <TextField
                    {...args}
                    boxed
                    size="xl2"
                    value="Metrom text field xl2"
                />
                <TextField
                    {...args}
                    boxed
                    size="xl4"
                    value="Metrom text field xl4"
                />
                <TextField
                    {...args}
                    boxed
                    size="xl5"
                    value="Metrom text field xl5"
                />
            </div>
        </div>
    ),
};
