import { CreateCampaignForm } from "@/src/components/create-campaign/form";
import type { TargetType } from "@metrom-xyz/sdk";

export default function CampaignFormPage({
    params,
}: {
    params: { target: TargetType; locale: string };
}) {
    return <CreateCampaignForm target={params.target} />;
}
