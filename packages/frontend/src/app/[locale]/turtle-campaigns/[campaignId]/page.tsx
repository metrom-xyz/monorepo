import { TURTLE_CAMPAIGNS } from "@/src/commons/turtle-campaigns";
import { TurtleCampaignDetails } from "@/src/components/turtle-campaign-details";
import { routing, type Locale } from "@/src/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export interface Params {
    campaignId: string;
    locale: Locale;
}

export interface TurtleDealDetailsPageProps {
    params: Promise<Params>;
}

export async function generateMetadata({ params }: TurtleDealDetailsPageProps) {
    const { campaignId } = await params;
    const t = await getTranslations();

    const campaign = TURTLE_CAMPAIGNS.find(({ id }) => id === campaignId);

    return {
        title: campaign
            ? t("turtleCampaignPage.header.title", { owner: campaign.owner })
            : t("turtleCampaignPage.header.fallback"),
    };
}

export default async function TurtleCampaignDetailsPage({
    params,
}: TurtleDealDetailsPageProps) {
    const { locale, campaignId } = await params;

    if (!routing.locales.includes(locale)) notFound();

    setRequestLocale(locale);

    return <TurtleCampaignDetails campaignId={campaignId} />;
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
