import { CreateCampaignForm } from "@/src/components/create-campaign/form";
import { routing, type Locale } from "@/src/i18n/routing";
import { CampaignType } from "@/src/types/campaign";
import { setRequestLocale } from "next-intl/server";

interface Params {
    type: CampaignType;
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
    const { type, locale } = await params;

    setRequestLocale(locale);

    return <CreateCampaignForm type={type} />;
}

export async function generateStaticParams() {
    return routing.locales.flatMap((locale) =>
        Object.values(CampaignType).map((type) => ({
            locale,
            type,
        })),
    );
}
