import { useTranslations } from "next-intl";
import { FormStepPreview } from "../../form-step-preview";
import { Duration } from "../../previews/duration";
import type { AaveV3CampaignPayload } from "@/src/types/campaign/aave-v3-campaign";
import { AaveV3Target } from "../../previews/aave-v3-target";
import type { CampaignPayloadErrors } from "@/src/types/campaign/common";
import { distributablesCompleted } from "@/src/utils/form";

interface AaveV3FormPreviewProps {
    payload: AaveV3CampaignPayload;
    errors: CampaignPayloadErrors;
}

export function AaveV3FormPreview({ payload, errors }: AaveV3FormPreviewProps) {
    const t = useTranslations("newCampaign.formPreview");

    const basicsCompleted =
        !errors.basics &&
        !!payload.chainId &&
        !!payload.brand &&
        !!payload.market &&
        !!payload.kind &&
        !!payload.collateral &&
        !!payload.startDate &&
        !!payload.endDate;

    const rewardsCompleted = distributablesCompleted(payload);

    return (
        <>
            <FormStepPreview
                title={t("campaignBasics")}
                completed={basicsCompleted}
                error={!!errors.basics}
            >
                <AaveV3Target payload={payload} />
                <Duration
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                />
            </FormStepPreview>
            {rewardsCompleted && (
                <FormStepPreview
                    title={t("rewards")}
                    completed={rewardsCompleted}
                    error={!!errors.rewards}
                ></FormStepPreview>
            )}
        </>
    );
}
