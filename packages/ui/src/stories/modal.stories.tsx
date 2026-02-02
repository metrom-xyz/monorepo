import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "storybook/preview-api";
import { Modal } from "../components/modal/index";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Typography } from "../components/typography";
import { TextInput } from "../components/text-input";

const meta: Meta = {
    title: "Utils/Modal",
    component: Modal,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof Modal>;

export const Base: Story = {
    render: (args) => {
        const [open, setOpen] = useState(false);

        function handleModalOnOpen() {
            setOpen(true);
        }

        function handleModalOnClose() {
            setOpen(false);
        }

        return (
            <>
                <Button onClick={handleModalOnOpen}>Open modal</Button>
                <Modal
                    {...args}
                    open={args.open || open}
                    onDismiss={handleModalOnClose}
                >
                    <Card className="max-w-fit">
                        <div className="flex flex-col gap-4">
                            <Typography uppercase>
                                My custom modal content
                            </Typography>
                            <TextInput label="Text input" />
                        </div>
                    </Card>
                </Modal>
            </>
        );
    },
};
