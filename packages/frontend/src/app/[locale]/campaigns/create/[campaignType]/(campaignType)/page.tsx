import { PickDistributablesType } from "@/src/components/create-campaign/pick-distributables-type";
import { routing, type Locale } from "@/src/i18n/routing";
import {
    BaseCampaignType,
    PartnerCampaignType,
    type CampaignType,
} from "@metrom-xyz/sdk";
import { setRequestLocale } from "next-intl/server";

interface Params {
    campaignType: CampaignType;
    locale: Locale;
}

interface PickCampaignDistributablesTypePageProps {
    params: Promise<Params>;
}

export const metadata = {
    title: "Pick campaign distributables type",
    openGraph: {
        images: ["/images/opengraph-image.png"],
    },
};

export default async function PickCampaignDistributablesTypePagee({
    params,
}: PickCampaignDistributablesTypePageProps) {
    const { campaignType, locale } = await params;

    setRequestLocale(locale);

    return <PickDistributablesType campaignType={campaignType} />;
}

export async function generateStaticParams() {
    const types: CampaignType[] = [
        ...Object.values(BaseCampaignType),
        ...Object.values(PartnerCampaignType),
    ];

    return routing.locales.flatMap((locale) =>
        types.map((campaignType) => ({
            locale,
            campaignType,
        })),
    );
}
