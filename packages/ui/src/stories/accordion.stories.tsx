import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "../components/accordion/index";
import { Typography } from "../components/typography";
import { TextInput } from "../components/text-input";

import styles from "./styles.module.css";

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
                <div className={styles.accordionContent}>
                    <Typography uppercase>
                        My custom accordion content
                    </Typography>
                    <TextInput label="Text input" placeholder="Placeholder" />
                </div>
            </Accordion>
        );
    },
};
