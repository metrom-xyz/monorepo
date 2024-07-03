import type { Meta, StoryObj } from "@storybook/vue3";
import MetNumberInput from "../src/components/number-input/MetNumberInput.vue";
import InfoIcon from "../src/icons/InfoIcon.vue";

const meta: Meta<typeof MetNumberInput> = {
    component: MetNumberInput,
    title: "Input/Number Input",
};

export default meta;

type Story = StoryObj<typeof MetNumberInput>;

export const Standard: Story = {
    render: () => ({
        components: {
            MetNumberInput,
        },
        template: `
            <div class="flex flex-col gap-4">
                <MetNumberInput label="Number input" placeholder="Number input" xs />
                <MetNumberInput label="Number input" placeholder="Number input" sm />
                <MetNumberInput label="Number input" placeholder="Number input" />
                <MetNumberInput label="Number input" placeholder="Number input" lg />
                <MetNumberInput label="Number input" placeholder="Number input" xl />
            </div>
        `,
    }),
};

export const Loading: Story = {
    render: () => ({
        components: {
            MetNumberInput,
        },
        template: `
            <MetNumberInput label="Number input" placeholder="Number input" loading />
        `,
    }),
};

export const NoBorder: Story = {
    render: () => ({
        components: {
            MetNumberInput,
        },
        template: `
            <MetNumberInput label="Number input" placeholder="Number input" borderless />
        `,
    }),
};

export const Error: Story = {
    render: () => ({
        components: {
            MetNumberInput,
        },
        template: `
            <div class="flex flex-col gap-4">
                <MetNumberInput label="Number input" placeholder="Number input" error="Error text" sm />
                <MetNumberInput label="Number input" placeholder="Number input" error="Error text" sm />
                <MetNumberInput label="Number input" placeholder="Number input" error="Error text" sm borderless />
            </div>
        `,
    }),
};

export const InfoPopover: Story = {
    render: () => ({
        components: {
            MetNumberInput,
        },
        template: `
            <MetNumberInput 
                label="Number input"
                placeholder="Number input"
                info="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget."
            />
        `,
    }),
};

export const WithIcon: Story = {
    render: () => ({
        components: {
            MetNumberInput,
        },
        data() {
            return { InfoIcon };
        },
        template: `
            <div class="flex flex-col gap-4">
                <MetNumberInput 
                    label="Number input"
                    placeholder="Number input"
                    :icon="InfoIcon"
                />                
                <MetNumberInput 
                    label="Number input"
                    placeholder="Number input"
                    :icon="InfoIcon"
                    iconLeft
                />
            </div>
        `,
    }),
};
