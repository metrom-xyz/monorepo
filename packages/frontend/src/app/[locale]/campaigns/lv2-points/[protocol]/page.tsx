import { ENVIRONMENT } from "@/src/commons/env";
import { LV2_POINTS_CAMPAIGNS } from "@/src/commons/lv2-points";
import { Lv2PointsCampaign } from "@/src/components/lv2-points-campaign";
import { routing, type Locale } from "@/src/i18n/routing";
import { SupportedLiquityV2 } from "@metrom-xyz/sdk";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export interface Params {
    protocol: SupportedLiquityV2;
    locale: Locale;
}

export interface Lv2PointsCampaignPageProps {
    params: Promise<Params>;
}

export async function generateMetadata({ params }: Lv2PointsCampaignPageProps) {
    const { protocol } = await params;
    const t = await getTranslations();

    return {
        title: t("lv2PointsCampaignPage.title", { protocol }),
    };
}

export default async function Lv2PointsCampaignPage({
    params,
}: Lv2PointsCampaignPageProps) {
    const { locale, protocol } = await params;

    if (
        !routing.locales.includes(locale) ||
        !LV2_POINTS_CAMPAIGNS[ENVIRONMENT][protocol]
    )
        notFound();

    setRequestLocale(locale);

    return <Lv2PointsCampaign protocol={protocol} />;
}

export async function generateStaticParams() {
    return routing.locales.flatMap((locale) =>
        Object.keys(LV2_POINTS_CAMPAIGNS[ENVIRONMENT]).map((protocol) => ({
            locale,
            protocol,
        })),
    );
}
