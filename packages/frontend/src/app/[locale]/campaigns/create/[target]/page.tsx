import { CreateCampaignForm } from "@/src/components/create-campaign/form";
import { routing } from "@/src/i18n/routing";
import type { TargetType } from "@metrom-xyz/sdk";

export default function CampaignFormPage({
    params,
}: {
    params: { target: TargetType; locale: string };
}) {
    return <CreateCampaignForm target={params.target} />;
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
