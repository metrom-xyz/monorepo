import { useTranslations } from "next-intl";
import { FormStepPreview } from "../../form-step-preview";
import { Duration } from "../../previews/duration";
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
import { HOLD_FUNGIBLE_ASSET_BASIC_PAYLOAD_KEYS } from "../hold-fungible-asset-form/hold-fungible-asset-basics-step";
import {
    getHoldFungibleAssetTargetValue,
    type HoldFungibleAssetCampaignPayload,
} from "@/src/types/campaign/hold-fungible-asset-campaign";
import { HoldFungibleAssetTarget } from "../../previews/hold-fungible-asset-target";

import styles from "./styles.module.css";

interface HoldFungibleAssetFormPreviewProps {
    payload: HoldFungibleAssetCampaignPayload;
    errors: FormSteps<string>;
}

export function HoldFungibleAssetFormPreview({
    payload,
    errors,
}: HoldFungibleAssetFormPreviewProps) {
    const globalT = useTranslations();
    const t = useTranslations("newCampaign.formPreview");

    const basicsCompleted =
        !errors.basics &&
        allFieldsFilled(payload, HOLD_FUNGIBLE_ASSET_BASIC_PAYLOAD_KEYS);

    const rewardsCompleted = distributablesCompleted(payload);
    const apr = getCampaignFormApr(
        payload,
        getHoldFungibleAssetTargetValue(payload),
    );

    return (
        <>
            <FormStepPreview
                title={
                    <div className={styles.basicsHeader}>
                        <Typography size="xs" weight="semibold" uppercase>
                            {t("campaignBasics")}
                        </Typography>
                        {payload.kind && payload.asset && (
                            <div className={styles.targetUsdChip}>
                                <Typography size="xs" weight="medium" uppercase>
                                    {getCampaignTargetValueName(
                                        globalT,
                                        payload.kind,
                                    )}
                                    :{" "}
                                    {formatUsdAmount({
                                        amount: getHoldFungibleAssetTargetValue(
                                            payload,
                                        )?.usd,
                                    })}
                                </Typography>
                            </div>
                        )}
                    </div>
                }
                completed={basicsCompleted}
                error={!!errors.basics}
            >
                <HoldFungibleAssetTarget payload={payload} />
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
                    fixedDistribution={payload.fixedDistribution}
                    distributables={payload.distributables}
                    restrictions={payload.restrictions}
                />
            )}
        </>
    );
}
