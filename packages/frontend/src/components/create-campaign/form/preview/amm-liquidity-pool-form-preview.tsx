import { useTranslations } from "next-intl";
import { FormStepPreview } from "../../form-step-preview";
import { Duration } from "../../previews/duration";
import {
    getAmmPoolLiquidityTargetValue,
    type AmmPoolLiquidityCampaignPayload,
} from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { AmmLiquidityPoolTarget } from "../../previews/amm-liquidity-pool-target";
import type { FormSteps } from "@/src/context/form-validation";
import {
    distributablesCompleted,
    getCampaignApr,
    rangeSpecificationCompleted,
} from "@/src/utils/form";
import { Rewards } from "../../previews/rewards";
import { PoolRange } from "../../previews/pool-range";

interface AmmLiquidityPoolFormPreviewProps {
    payload: AmmPoolLiquidityCampaignPayload;
    errors: FormSteps<string>;
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

    const rewardsCompleted = distributablesCompleted(payload);
    const poolRangeCompleted = rangeSpecificationCompleted(payload);
    const apr = getCampaignApr(
        payload,
        getAmmPoolLiquidityTargetValue(payload),
    );

    return (
        <>
            <FormStepPreview
                title={t("campaignBasics")}
                completed={completed}
                error={!!errors.basics}
            >
                <AmmLiquidityPoolTarget payload={payload} />
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
                    pool={payload.pool}
                    weighting={payload.weighting}
                    restrictions={payload.restrictions}
                />
            )}
            {poolRangeCompleted && (
                <PoolRange
                    pool={payload.pool}
                    priceRangeSpecification={payload.priceRangeSpecification}
                />
            )}
        </>
    );
}
