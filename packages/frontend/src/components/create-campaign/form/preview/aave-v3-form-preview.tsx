import { useTranslations } from "next-intl";
import { FormStepPreview } from "../../form-step-preview";
import { Duration } from "../../previews/duration";
import {
    getAaveV3TargetValue,
    type AaveV3CampaignPayload,
} from "@/src/types/campaign/aave-v3-campaign";
import { AaveV3Target } from "../../previews/aave-v3-target";
import {
    allFieldsFilled,
    distributablesCompleted,
    getCampaignFormApr,
} from "@/src/utils/form";
import type { FormSteps } from "@/src/context/form-steps";
import { Typography } from "@metrom-xyz/ui";
import { getCampaignTargetValueName } from "@/src/utils/campaign";
import { formatUsdAmount } from "@/src/utils/format";
import { getAaveV3UsdTarget } from "@/src/utils/aave-v3";
import { Rewards } from "../../previews/rewards";
import { useAaveV3CollateralUsdNetSupply } from "@/src/hooks/useAaveV3CollateralUsdNetSupply";
import { useChainType } from "@/src/hooks/useChainType";
import { CampaignKind } from "@metrom-xyz/sdk";
import { AAVE_V3_REQUIRED_PAYLOAD_KEYS } from "../aave-v3-form/aave-v3-basics-step";
import { Kpi } from "../../previews/kpi";

import styles from "./styles.module.css";

interface AaveV3FormPreviewProps {
    payload: AaveV3CampaignPayload;
    errors: FormSteps<string>;
}

export function AaveV3FormPreview({ payload, errors }: AaveV3FormPreviewProps) {
    const globalT = useTranslations();
    const t = useTranslations("newCampaign.formPreview");
    const chainType = useChainType();

    const {
        loading: loadingCollateralUsdNetSupply,
        usdNetSupply: collateralUsdNetSupply,
    } = useAaveV3CollateralUsdNetSupply({
        chainId: payload.chainId,
        chainType,
        brand: payload.brand?.slug,
        market: payload.market?.address,
        collateral: payload.collateral?.address,
        blacklistedCrossBorrowCollaterals: payload.blacklistedCollaterals?.map(
            ({ address }) => address,
        ),
        enabled: payload.kind === CampaignKind.AaveV3NetSupply,
    });

    const basicsCompleted =
        !errors.basics &&
        allFieldsFilled(payload, AAVE_V3_REQUIRED_PAYLOAD_KEYS);

    const usdNetSupply =
        payload.kind === CampaignKind.AaveV3NetSupply
            ? collateralUsdNetSupply
            : undefined;

    const rewardsCompleted = distributablesCompleted(payload);
    const apr = getCampaignFormApr(
        payload,
        getAaveV3TargetValue(payload, usdNetSupply),
    );
    const kpiSetup = payload?.kpiDistribution;

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
                                        amount: getAaveV3UsdTarget({
                                            collateral: payload.collateral,
                                            kind: payload.kind,
                                        }),
                                    })}
                                </Typography>
                            </div>
                        )}
                    </div>
                }
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
                <Rewards
                    chainId={payload.chainId}
                    apr={apr}
                    loadingApr={loadingCollateralUsdNetSupply}
                    completed={rewardsCompleted}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    distributables={payload.distributables}
                    restrictions={payload.restrictions}
                />
            )}
            {kpiSetup && <Kpi kpiDistribution={payload.kpiDistribution} />}
        </>
    );
}
