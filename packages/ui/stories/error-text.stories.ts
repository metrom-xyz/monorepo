import type { Meta, StoryObj } from "@storybook/vue3";

import MetErrorText from "../src/components/error-text/MetErrorText.vue";

const meta: Meta<typeof MetErrorText> = {
    component: MetErrorText,
    title: "Data display/Error Text",
};

export default meta;

type Story = StoryObj<typeof MetErrorText>;

export const ErrorText: Story = {
    render: () => ({
        components: { MetErrorText },
        template: `
            <MetErrorText>
                Error text example
            </MetErrorText>
        `,
    }),
};
