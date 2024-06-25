import type { Meta, StoryObj } from "@storybook/vue3";
import MetAccordion from "../src/components/accordion/MetAccordion.vue";
import MetAccordionSummary from "../src/components/accordion/summary/MetAccordionSummary.vue";
import MetTypography from "../src/components/typography/MetTypography.vue";

const meta: Meta<typeof MetAccordion> = {
    component: MetAccordion,
    title: "Data Display/Accordion",
};

export default meta;

type Story = StoryObj<typeof MetAccordion>;

export const Accordion: Story = {
    render: () => ({
        components: {
            MetAccordion,
            MetAccordionSummary,
            MetTypography,
        },
        template: `
            <div>
                <MetAccordion>
                    <template #summary>First accordion</template>
                    <MetTypography sm>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                    </MetTypography>
                </MetAccordion>
                <MetAccordion>
                    <template #summary>Second accordion</template>
                    <MetTypography sm>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                    </MetTypography>
                </MetAccordion>
                <MetAccordion>
                    <template #summary>Third accordion</template>
                    <MetTypography sm>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                    </MetTypography>
                </MetAccordion>
                <MetAccordion>
                    <template #summary>Fourth accordion</template>
                    <MetTypography sm>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                    </MetTypography>
                </MetAccordion>
                <MetAccordion>
                    <template #summary>Fifth accordion</template>
                    <MetTypography sm>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                    </MetTypography>
                </MetAccordion>
            </div>
        `,
    }),
};
