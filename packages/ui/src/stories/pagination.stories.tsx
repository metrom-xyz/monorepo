import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "storybook/preview-api";
import { Pagination } from "../components/pagination/index";

const meta: Meta = {
    title: "Surfaces/Pagination",
    component: Pagination,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        totalPages: 20,
        messages: {
            previous: "Prev",
            next: "Next",
        },
    },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Base: Story = {
    render: (args) => {
        const [value, setValue] = useState(1);

        function handleOnPageNext() {
            setValue((prev) => prev + 1);
        }

        function handleOnPagePrevious() {
            setValue((prev) => prev - 1);
        }

        function handleOnPage(page: number) {
            setValue(page);
        }

        return (
            <Pagination
                {...args}
                page={args.page || value}
                onNext={handleOnPageNext}
                onPrevious={handleOnPagePrevious}
                onPage={handleOnPage}
            />
        );
    },
};
