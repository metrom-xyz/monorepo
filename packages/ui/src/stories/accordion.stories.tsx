import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "../components/accordion/index";
import { Typography } from "../components/typography";
import { TextInput } from "../components/text-input";

const meta: Meta = {
    title: "Surfaces/Accordion",
    component: Accordion,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "Gray",
        },
    },
    tags: ["autodocs"],
    args: { title: "Metrom accordion" },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Base: Story = {
    render: (args) => {
        return (
            <Accordion {...args}>
                <div className="flex flex-col gap-4 p-4">
                    <Typography uppercase>
                        My custom accordion content
                    </Typography>
                    <TextInput label="Text input" />
                </div>
            </Accordion>
        );
    },
};
