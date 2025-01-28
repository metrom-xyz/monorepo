import { CampaignDetails } from "@/src/components/campaign-details";
import { routing } from "@/src/i18n/routing";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Hex } from "viem";

interface Params {
    chain: SupportedChain;
    campaignId: Hex;
    locale: string;
}

interface CampaignDetailsPageProps {
    params: Promise<Params>;
}

export default async function CampaignDetailsPage({
    params,
}: CampaignDetailsPageProps) {
    const { locale, chain, campaignId } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    setRequestLocale(locale);

    return <CampaignDetails chain={chain} campaignId={campaignId} />;
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
