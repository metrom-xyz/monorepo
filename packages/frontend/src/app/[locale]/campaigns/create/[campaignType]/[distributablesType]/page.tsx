import { CreateCampaignForm } from "@/src/components/create-campaign/form";
import { routing, type Locale } from "@/src/i18n/routing";
import {
    BaseCampaignType,
    DistributablesType,
    PartnerCampaignType,
    type CampaignType,
} from "@metrom-xyz/sdk";
import { setRequestLocale } from "next-intl/server";

interface Params {
    campaignType: CampaignType;
    distributablesType: DistributablesType;
    locale: Locale;
}

interface CampaignFormPageProps {
    params: Promise<Params>;
}

export const metadata = {
    title: "Create new campaign",
    openGraph: {
        images: ["/images/opengraph-image.png"],
    },
};

export default async function CampaignFormPage({
    params,
}: CampaignFormPageProps) {
    const { campaignType, distributablesType, locale } = await params;

    setRequestLocale(locale);

    return (
        <CreateCampaignForm
            campaignType={campaignType}
            distributablesType={distributablesType}
        />
    );
}

export async function generateStaticParams() {
    const campaignTypes: CampaignType[] = [
        ...Object.values(BaseCampaignType),
        ...Object.values(PartnerCampaignType),
    ];
    const distributablesTypes: DistributablesType[] = [
        DistributablesType.Tokens,
        DistributablesType.FixedPoints,
    ];

    return routing.locales.flatMap((locale) =>
        campaignTypes.flatMap((campaignType) =>
            distributablesTypes.map((distributablesType) => ({
                locale,
                campaignType,
                distributablesType,
            })),
        ),
    );
}
