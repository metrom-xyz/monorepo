import type { Meta, StoryObj } from "@storybook/vue3";
import MetRemoteLogo from "../src/components/remote-logo/MetRemoteLogo.vue";

const meta: Meta<typeof MetRemoteLogo> = {
    component: MetRemoteLogo,
    title: "Data Display/Remote logo",
};

export default meta;

type Story = StoryObj<typeof MetRemoteLogo>;

export const RemoteLogo: Story = {
    name: "Remote logo",
    render: () => ({
        components: { MetRemoteLogo },
        template: `
            <div class="flex flex-col gap-4">
                <MetRemoteLogo src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"/>
                <MetRemoteLogo :src="['https://foo.bar']"/>
                <MetRemoteLogo src="https://picsum.photos/200"/>
                <MetRemoteLogo />
                <MetRemoteLogo :src="['https://foo.bar']" defaultText="FOO" />
            </div>
        `,
    }),
};
