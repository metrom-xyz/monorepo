import type { Meta, StoryObj } from "@storybook/vue3";
import MetCard from "../src/components/MetCard.vue";
import MetButton from "../src/components/button/MetButton.vue";
import MetStep from "../src/components/stepper/step/MetStep.vue";
import MetStepper from "../src/components/stepper/MetStepper.vue";
import MetTypography from "../src/components/typography/MetTypography.vue";
import InfoIcon from "../src/icons/InfoIcon.vue";
import { markRaw, ref } from "vue";

const meta: Meta<typeof MetStepper> = {
    component: MetStepper,
    title: "Navigation/Stepper",
};

export default meta;

type Story = StoryObj<typeof MetStepper>;

export const Standard: Story = {
    name: "Stepper",
    render: () => ({
        setup() {
            const step = ref(0);

            return { step };
        },
        components: {
            MetStepper,
            MetStep,
            MetCard,
            MetButton,
            MetTypography,
        },
        data() {
            return { InfoIcon: markRaw(InfoIcon) };
        },
        template: `
            <div class="flex justify-center">
                <div class="w-1/2">
                    <MetStepper>
                        <MetStep
                            :step="0"
                            title="Step 1"
                            :active="step === 0"
                            :icon="InfoIcon"
                        >
                            <MetCard>
                                <template #title>
                                    <MetTypography medium lg>
                                        Step content
                                    </MetTypography>
                                </template>
                                <template #content>
                                    <div class="flex flex-col gap-2 p-3">
                                        <MetTypography>Click to move to next step</MetTypography>
                                        <MetButton @click="step++" sm>Next</MetButton>
                                    </div>
                                </template>
                            </MetCard>
                        </MetStep>
                        <MetStep
                            :step="1"
                            title="Step 2"
                            :active="step === 1"
                            :icon="InfoIcon"
                        >
                            <MetCard>
                                <template #title>
                                    <MetTypography medium lg>
                                        Step content
                                    </MetTypography>
                                </template>
                                <template #content>
                                    <div class="flex flex-col gap-2 p-3">
                                        <MetTypography>Click to move to next step</MetTypography>
                                        <MetButton @click="step++" sm>Next</MetButton>
                                        <MetButton @click="step--" sm secondary>Back</MetButton>
                                    </div>
                                </template>
                            </MetCard>
                        </MetStep>
                        <MetStep
                            :step="2"
                            title="Step 3"
                            :active="step === 2"
                            :icon="InfoIcon"
                        >
                            <MetCard>
                                <template #title>
                                    <MetTypography medium lg>
                                        Step content
                                    </MetTypography>
                                </template>
                                <template #content>
                                    <div class="flex flex-col gap-2 p-3">
                                        <MetTypography>Final step</MetTypography>
                                        <MetButton @click="step--" sm secondary>Back</MetButton>
                                    </div>
                                </template>
                            </MetCard>
                        </MetStep>
                    </MetStepper>
                </div>
            </div>
        `,
    }),
};
