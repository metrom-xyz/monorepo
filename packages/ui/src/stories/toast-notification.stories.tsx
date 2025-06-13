import type { Meta, StoryObj } from "@storybook/react-vite";
import {
    Toaster,
    ToastNotification,
} from "../components/toast-notification/index";
import { toast } from "sonner";
import { Button } from "../components/button";
import { Typography } from "../components/typography";
import { SettingsIcon } from "../assets/settings";

const meta: Meta = {
    title: "Feedback/Toast notification",
    component: ToastNotification,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "Gray",
        },
    },
    tags: ["autodocs"],
    args: {
        title: "Notification title",
        icon: SettingsIcon,
    },
} satisfies Meta<typeof ToastNotification>;

export default meta;
type Story = StoryObj<typeof ToastNotification>;

export const Base: Story = {
    render: (args) => {
        return (
            <>
                <Button
                    onClick={() =>
                        toast.custom((toastId) => (
                            <ToastNotification {...args} toastId={toastId}>
                                <Typography>Notification text</Typography>
                            </ToastNotification>
                        ))
                    }
                >
                    Open toast notification
                </Button>
                <Toaster />
            </>
        );
    },
};
