import { CreateCampaignForm } from "@/src/components/create-campaign/form";
import { routing } from "@/src/i18n/routing";
import type { CampaignType } from "@/src/types";
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

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
