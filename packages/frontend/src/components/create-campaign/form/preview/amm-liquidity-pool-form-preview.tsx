import { useTranslations } from "next-intl";
import { FormStepPreview } from "../../form-step-preview";
import { Duration } from "../../previews/duration";
import type { AmmPoolLiquidityCampaignPayload } from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { AmmLiquidityPoolTarget } from "../../previews/amm-liquidity-pool-target";
import type { CampaignPayloadErrors } from "@/src/types/campaign/common";

interface AmmLiquidityPoolFormPreviewProps {
    payload: AmmPoolLiquidityCampaignPayload;
    errors: CampaignPayloadErrors;
}

export function AmmLiquidityPoolFormPreview({
    payload,
    errors,
}: AmmLiquidityPoolFormPreviewProps) {
    const t = useTranslations("newCampaign.formPreview");

    const completed =
        !errors.basics &&
        !!payload.chainId &&
        !!payload.dex &&
        !!payload.pool &&
        !!payload.startDate &&
        !!payload.endDate;

    return (
        <FormStepPreview
            title={t("campaignBasics")}
            completed={completed}
            error={!!errors.basics}
        >
            <AmmLiquidityPoolTarget payload={payload} />
            <Duration startDate={payload.startDate} endDate={payload.endDate} />
        </FormStepPreview>
    );
}
