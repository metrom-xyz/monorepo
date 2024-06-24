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
                <MetAccordion summary="First accordion">
                    <MetTypography sm>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                    </MetTypography>
                </MetAccordion>
                <MetAccordion summary="Second accordion">
                    <MetTypography sm>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                    </MetTypography>
                </MetAccordion>
                <MetAccordion summary="Third accordion">
                    <MetTypography sm>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                    </MetTypography>
                </MetAccordion>
                <MetAccordion summary="Fourth accordion">
                    <MetTypography sm>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                    </MetTypography>
                </MetAccordion>
                <MetAccordion summary="Fifth accordion">
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
