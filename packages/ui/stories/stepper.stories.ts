import type { Meta, StoryObj } from "@storybook/vue3";
import MetStepper from "../src/components/stepper/MetStepper.vue";
import MetTypography from "../src/components/typography/MetTypography.vue";
import { ref } from "vue";

const meta: Meta<typeof MetStepper> = {
    component: MetStepper,
    title: "Navigation/Stepper",
};

export default meta;

type Story = StoryObj<typeof MetStepper>;

export const Automatic: Story = {
    render: () => ({
        setup() {
            const step = ref(0);

            return { step };
        },
        components: {
            MetStepper,
            MetTypography,
        },
        template: `
            <div class="flex flex-col gap-4">
                <MetStepper
                    :stepTitles="['Long step title 1', 'Step 2', 'Step 3', 'Step 4']"
                    :activeStep="step"
                    :lastStepCompleted="2"
                    @change="(index) => step = index"
                />
                <MetTypography v-if="step === 0">Step 1</MetTypography>
                <MetTypography v-if="step === 1">Step 2</MetTypography>
                <MetTypography v-if="step === 2">Step 3</MetTypography>
                <MetTypography v-if="step === 3">Step 4</MetTypography>
            </div>
        `,
    }),
};

export const Vertical: Story = {
    render: () => ({
        setup() {
            const step = ref(0);

            return { step };
        },
        components: {
            MetStepper,
            MetTypography,
        },
        template: `
            <div class="flex flex-col gap-4">
                <MetStepper
                    vertical
                    :stepTitles="['Long step title 1', 'Step 2', 'Step 3', 'Step 4']"
                    :activeStep="step"
                    :lastStepCompleted="2"
                    @change="(index) => step = index"
                />
                <MetTypography v-if="step === 0">Step 1</MetTypography>
                <MetTypography v-if="step === 1">Step 2</MetTypography>
                <MetTypography v-if="step === 2">Step 3</MetTypography>
                <MetTypography v-if="step === 3">Step 4</MetTypography>
            </div>
        `,
    }),
};

export const Horizontal: Story = {
    render: () => ({
        setup() {
            const step = ref(0);

            return { step };
        },
        components: {
            MetStepper,
            MetTypography,
        },
        template: `
            <div class="flex flex-col gap-4">
                <MetStepper
                    horizontal
                    :stepTitles="['Long step title 1', 'Step 2', 'Step 3', 'Step 4']"
                    :activeStep="step"
                    :lastStepCompleted="2"
                    @change="(index) => step = index"
                />
                <MetTypography v-if="step === 0">Step 1</MetTypography>
                <MetTypography v-if="step === 1">Step 2</MetTypography>
                <MetTypography v-if="step === 2">Step 3</MetTypography>
                <MetTypography v-if="step === 3">Step 4</MetTypography>
            </div>
        `,
    }),
};
