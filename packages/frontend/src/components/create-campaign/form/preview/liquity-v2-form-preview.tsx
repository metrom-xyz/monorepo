import { useTranslations } from "next-intl";
import { FormStepPreview } from "../../form-step-preview";
import { Duration } from "../../previews/duration";
import {
    getLiquityV2TargetValue,
    type LiquityV2CampaignPayload,
} from "@/src/types/campaign/liquity-v2-campaign";
import {
    allFieldsFilled,
    distributablesCompleted,
    getCampaignFormApr,
} from "@/src/utils/form";
import type { FormSteps } from "@/src/context/form-steps";
import { Typography } from "@metrom-xyz/ui";
import { getCampaignTargetValueName } from "@/src/utils/campaign";
import { formatUsdAmount } from "@/src/utils/format";
import { Rewards } from "../../previews/rewards";
import { LIQUITY_V2_BASIC_PAYLOAD_KEYS } from "../liquity-v2-forks-form/liquity-v2-basics-step";
import { LiquityV2Target } from "../../previews/liquity-v2-target";

import styles from "./styles.module.css";

interface LiquityV2FormPreviewProps {
    payload: LiquityV2CampaignPayload;
    errors: FormSteps<string>;
}

export function LiquityV2FormPreview({
    payload,
    errors,
}: LiquityV2FormPreviewProps) {
    const globalT = useTranslations();
    const t = useTranslations("newCampaign.formPreview");

    const basicsCompleted =
        !errors.basics &&
        allFieldsFilled(payload, LIQUITY_V2_BASIC_PAYLOAD_KEYS);

    const rewardsCompleted = distributablesCompleted(payload);
    const apr = getCampaignFormApr(payload, getLiquityV2TargetValue(payload));

    return (
        <>
            <FormStepPreview
                title={
                    <div className={styles.basicsHeader}>
                        <Typography size="xs" weight="semibold" uppercase>
                            {t("campaignBasics")}
                        </Typography>
                        {payload.kind && payload.collateral && (
                            <div className={styles.targetUsdChip}>
                                <Typography size="xs" weight="medium" uppercase>
                                    {getCampaignTargetValueName(
                                        globalT,
                                        payload.kind,
                                    )}
                                    :{" "}
                                    {formatUsdAmount({
                                        amount: getLiquityV2TargetValue(payload)
                                            ?.usd,
                                    })}
                                </Typography>
                            </div>
                        )}
                    </div>
                }
                completed={basicsCompleted}
                error={!!errors.basics}
            >
                <LiquityV2Target payload={payload} />
                <Duration
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                />
            </FormStepPreview>
            {rewardsCompleted && (
                <Rewards
                    chainId={payload.chainId}
                    apr={apr}
                    completed={rewardsCompleted}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    distributables={payload.distributables}
                    restrictions={payload.restrictions}
                />
            )}
        </>
    );
}
