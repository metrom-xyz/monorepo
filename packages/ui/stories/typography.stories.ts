import type { Meta, StoryObj } from "@storybook/vue3";

import MetTypography from "../src/components/typography/MetTypography.vue";

const meta: Meta<typeof MetTypography> = {
    component: MetTypography,
    title: "Data display/Typography",
};

export default meta;

type Story = StoryObj<typeof MetTypography>;

export const Typography: Story = {
    render: () => ({
        components: { MetTypography },
        template: `
            <div class="flex flex-col">
                <MetTypography h1>Heading 1 text</MetTypography>
                <MetTypography h2>Heading 2 text</MetTypography>
                <MetTypography h3>Heading 3 text</MetTypography>
                <MetTypography h4>Heading 4 text</MetTypography>
                <MetTypography xl>Extra large body text</MetTypography>
                <MetTypography lg>Large body text</MetTypography>
                <MetTypography>Base body text</MetTypography>
                <MetTypography sm>Small body text</MetTypography>
                <MetTypography xs>Extra small body text</MetTypography>

                <MetTypography uppercase h1>Heading 1 text</MetTypography>
                <MetTypography uppercase h2>Heading 2 text</MetTypography>
                <MetTypography uppercase h3>Heading 3 text</MetTypography>
                <MetTypography uppercase h4>Heading 4 text</MetTypography>
                <MetTypography uppercase xl>Extra large body text</MetTypography>
                <MetTypography uppercase lg>Large body text</MetTypography>
                <MetTypography uppercase>Base body text</MetTypography>
                <MetTypography uppercase sm>Small body text</MetTypography>
                <MetTypography uppercase xs>Extra small body text</MetTypography>
            </div>
        `,
    }),
};
