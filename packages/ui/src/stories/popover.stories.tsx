import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "@storybook/preview-api";
import { Popover } from "../components/popover/index";
import { Card } from "../components/card";
import { Typography } from "../components/typography";
import { TextField } from "../components/text-field";

const meta: Meta = {
    title: "Utils/Popover",
    component: Popover,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: { placement: "top" },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof Popover>;

export const Base: Story = {
    render: (args) => {
        const [open, setOpen] = useState(false);
        const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);
        const popoverRef = useRef<HTMLDivElement | null>(null);

        function handlePopoverOnOpen() {
            setOpen(true);
        }

        function handlePopoverOnClose() {
            setOpen(false);
        }

        return (
            <>
                <Typography
                    ref={setWrapper}
                    onMouseEnter={handlePopoverOnOpen}
                    onMouseLeave={handlePopoverOnClose}
                >
                    Hover to open popover
                </Typography>
                <Popover
                    {...args}
                    ref={popoverRef}
                    anchor={wrapper}
                    open={args.open || open}
                >
                    <Card className="max-w-fit">
                        <div className="flex flex-col gap-4">
                            <Typography uppercase>
                                My custom popover content
                            </Typography>
                            <TextField label="Field" value="Description" />
                        </div>
                    </Card>
                </Popover>
            </>
        );
    },
};
