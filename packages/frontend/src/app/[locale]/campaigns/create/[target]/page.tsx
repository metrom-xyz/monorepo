import { CreateCampaignForm } from "@/src/components/create-campaign/form";
import { routing } from "@/src/i18n/routing";
import type { TargetType } from "@metrom-xyz/sdk";
import { setRequestLocale } from "next-intl/server";

export default async function CampaignFormPage({
    params,
}: {
    params: { target: TargetType; locale: string };
}) {
    const { target, locale } = await params;

    setRequestLocale(locale);

    return <CreateCampaignForm target={target} />;
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
