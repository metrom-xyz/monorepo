import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "@storybook/preview-api";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "../components/date-picker/index";
import { Card } from "../components/card";

const meta: Meta = {
    title: "Input/Date picker",
    component: DatePicker,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Base: Story = {
    render: (args) => {
        const [date, setDate] = useState<Dayjs>(dayjs());

        return (
            <Card>
                <DatePicker {...args} value={date} onChange={setDate} />
            </Card>
        );
    },
};

export const WithMinMax: Story = {
    render: (args) => {
        const [date, setDate] = useState<Dayjs>(dayjs());

        return (
            <Card>
                <DatePicker
                    {...args}
                    min={dayjs().subtract(3, "days")}
                    max={dayjs().add(7, "days")}
                    value={date}
                    onChange={setDate}
                />
            </Card>
        );
    },
};

export const WithRange: Story = {
    render: (args) => {
        const [date, setDate] = useState<Dayjs>(dayjs());

        return (
            <Card>
                <DatePicker
                    {...args}
                    value={date}
                    range={{
                        from: dayjs().subtract(3, "days"),
                        to: dayjs().add(7, "days"),
                    }}
                    onChange={setDate}
                />
            </Card>
        );
    },
};
