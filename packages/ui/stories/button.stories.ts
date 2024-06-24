import type { Meta, StoryObj } from "@storybook/vue3";
import MetButton from "../src/components/button/MetButton.vue";
import InfoIcon from "../src/icons/InfoIcon.vue";

const meta: Meta<typeof MetButton> = {
    component: MetButton,
    title: "Input/Button",
};

export default meta;

type Story = StoryObj<typeof MetButton>;

export const Standard: Story = {
    render: () => ({
        components: {
            MetButton,
        },
        template: `
            <div class="flex flex-col gap-4">
                <MetButton xs>Xsmall Button</MetButton>
                <MetButton sm>Small Button</MetButton>
                <MetButton lg>Large button</MetButton>
                <MetButton loading>Loading</MetButton>
            </div>
        `,
    }),
};

export const WithIcon: Story = {
    render: () => ({
        components: {
            MetButton,
        },
        data() {
            return {
                InfoIcon,
            };
        },
        template: `
            <div class="flex flex-col gap-4">
                <MetButton :icon="InfoIcon">
                    Button
                </MetButton>
                <MetButton loading :icon="InfoIcon">
                    Button
                </MetButton>
                <MetButton :icon="InfoIcon" iconRight>
                    Button
                </MetButton>
            </div>
        `,
    }),
};

export const IconOnly: Story = {
    render: () => ({
        components: {
            MetButton,
        },
        data() {
            return {
                InfoIcon,
            };
        },
        template: `
            <MetButton loading :icon="InfoIcon">
            </MetButton>
        `,
    }),
};

export const Disabled: Story = {
    render: () => ({
        components: {
            MetButton,
        },
        template: `
            <MetButton disabled>Button</MetButton>
        `,
    }),
};

export const Secondary: Story = {
    render: () => ({
        components: {
            MetButton,
        },
        template: `
            <MetButton secondary>Button</MetButton>
        `,
    }),
};

export const Active: Story = {
    render: () => ({
        components: {
            MetButton,
        },
        template: `
            <MetButton active>I'm active</MetButton>
        `,
    }),
};
