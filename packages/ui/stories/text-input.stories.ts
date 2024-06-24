import type { Meta, StoryObj } from "@storybook/vue3";
import MetTextInput from "../src/components/MetTextInput.vue";
import InfoIcon from "../src/icons/InfoIcon.vue";

const meta: Meta<typeof MetTextInput> = {
    component: MetTextInput,
    title: "Input/Text Input",
};

export default meta;

type Story = StoryObj<typeof MetTextInput>;

export const Standard: Story = {
    render: () => ({
        components: {
            MetTextInput,
        },
        template: `
            <div class="flex flex-col gap-4">
                <MetTextInput label="Text input" placeholder="Text input" xs />
                <MetTextInput label="Text input" placeholder="Text input" sm />
                <MetTextInput label="Text input" placeholder="Text input" />
                <MetTextInput label="Text input" placeholder="Text input" lg />
                <MetTextInput label="Text input" placeholder="Text input" xl />
            </div>
        `,
    }),
};

export const Loading: Story = {
    render: () => ({
        components: {
            MetTextInput,
        },
        template: `
            <MetTextInput label="Text input" placeholder="Text input" loading />
        `,
    }),
};

export const NoBorder: Story = {
    render: () => ({
        components: {
            MetTextInput,
        },
        template: `
            <MetTextInput label="Text input" placeholder="Text input" borderless />
        `,
    }),
};

export const Error: Story = {
    render: () => ({
        components: {
            MetTextInput,
        },
        template: `
            <div class="flex flex-col gap-4">
                <MetTextInput label="Text input" placeholder="Text input" error="Error text" sm />
                <MetTextInput label="Text input" placeholder="Text input" error="Error text" sm />
                <MetTextInput label="Text input" placeholder="Text input" error="Error text" sm borderless />
            <div class="flex flex-col gap-4">
        `,
    }),
};

export const InfoPopover: Story = {
    render: () => ({
        components: {
            MetTextInput,
        },
        template: `
            <MetTextInput 
                label="Text input"
                placeholder="Text input"
                info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
            />
        `,
    }),
};

export const WithIcon: Story = {
    render: () => ({
        components: {
            MetTextInput,
        },
        data() {
            return { InfoIcon };
        },
        template: `
            <div class="flex flex-col gap-4">
                <MetTextInput 
                    label="Text input"
                    placeholder="Text input"
                    :icon="InfoIcon"
                />                
                <MetTextInput 
                    label="Text input"
                    placeholder="Text input"
                    :icon="InfoIcon"
                    iconLeft
                />
            </div>
        `,
    }),
};
