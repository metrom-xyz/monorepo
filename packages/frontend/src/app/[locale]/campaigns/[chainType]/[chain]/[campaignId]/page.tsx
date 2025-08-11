import { METROM_API_CLIENT } from "@/src/commons";
import { CampaignDetails } from "@/src/components/campaign-details";
import { routing, type Locale } from "@/src/i18n/routing";
import { getCampaignName } from "@/src/utils/campaign";
import type { SupportedChain } from "@metrom-xyz/contracts";
import type { ChainType } from "@metrom-xyz/sdk";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Hex } from "viem";

export interface Params {
    chain: SupportedChain;
    chainType: ChainType;
    campaignId: Hex;
    locale: Locale;
}

export interface CampaignDetailsPageProps {
    params: Promise<Params>;
}

export async function generateMetadata({ params }: CampaignDetailsPageProps) {
    const { chain, chainType, campaignId } = await params;
    const t = await getTranslations();

    try {
        const campaignData = await METROM_API_CLIENT.fetchCampaign({
            id: campaignId,
            chainType,
            chainId: chain,
        });

        return {
            title:
                getCampaignName(t, campaignData) || t("campaignDetails.title"),
        };
    } catch {
        return {
            title: t("campaignDetails.notFound"),
        };
    }
}

export default async function CampaignDetailsPage({
    params,
}: CampaignDetailsPageProps) {
    const { locale, chain, chainType, campaignId } = await params;

    if (!routing.locales.includes(locale)) notFound();

    setRequestLocale(locale);

    return (
        <CampaignDetails
            chain={chain}
            chainType={chainType}
            campaignId={campaignId}
        />
    );
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
