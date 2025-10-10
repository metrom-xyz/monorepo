import type { CampaignKind } from "@metrom-xyz/sdk";
import { useTranslations } from "next-intl";
import { getCampaignTargetValueName } from "../utils/campaign";

interface UseCampaignTargetValueNameProps {
    kind?: CampaignKind;
}

export function useCampaignTargetValueName({
    kind,
}: UseCampaignTargetValueNameProps) {
    const t = useTranslations();
    return (kind && getCampaignTargetValueName(t, kind)) || "";
}
