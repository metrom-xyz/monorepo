import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { getCampaignPreviewName } from "@/src/utils/campaign";
import type { EmptyTargetCampaignPreviewPayload } from "@/src/types/campaign/empty-target-campaign";

interface EmptyProps {
    payload: EmptyTargetCampaignPreviewPayload;
}

export function Empty({ payload }: EmptyProps) {
    const t = useTranslations();

    return (
        <Typography weight="medium" size="xl">
            {getCampaignPreviewName(t, payload)}
        </Typography>
    );
}
