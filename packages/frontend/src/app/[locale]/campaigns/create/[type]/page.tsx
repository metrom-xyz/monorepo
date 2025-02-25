import { CreateCampaignForm } from "@/src/components/create-campaign/form";
import { routing } from "@/src/i18n/routing";
import { CampaignType } from "@/src/types/common";
import { setRequestLocale } from "next-intl/server";

interface Params {
    type: CampaignType;
    locale: string;
}

interface CampaignFormPageProps {
    params: Promise<Params>;
}

export default async function CampaignFormPage({
    params,
}: CampaignFormPageProps) {
    const { type, locale } = await params;

    setRequestLocale(locale);

    return <CreateCampaignForm type={type} />;
}

export async function generateStaticParams() {
    return routing.locales.flatMap((locale) =>
        [CampaignType.AmmPoolLiquidity, CampaignType.LiquityV2].map((type) => ({
            locale,
            type,
        })),
    );
}
