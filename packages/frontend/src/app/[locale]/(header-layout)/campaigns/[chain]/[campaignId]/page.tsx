import { CampaignDetails } from "@/src/components/campaign-details";
import { routing } from "@/src/i18n/routing";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Hex } from "viem";

export default function CampaignDetailsPage({
    params,
}: {
    params: { chain: SupportedChain; campaignId: Hex; locale: string };
}) {
    if (!routing.locales.includes(params.locale as any)) {
        notFound();
    }

    unstable_setRequestLocale(params.locale);

    return (
        <CampaignDetails chain={params.chain} campaignId={params.campaignId} />
    );
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
