import type {
    AmmPoolLiquidityCampaignPayload,
    AmmPoolLiquidityCampaignPayloadPart,
} from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { ChainSelect } from "../../inputs/chain-select";
import { DexSelect } from "../../inputs/dex-select";
import { PoolSelect } from "../../inputs/pool-select";
import { CampaignBasicsStep } from "../../steps/campaign-basics-step";
import { StepSection } from "../step-section";
import type { BaseCampaignPayloadPart } from "@/src/types/campaign/common";
import { useTranslations } from "next-intl";
import { BaseCampaignType } from "@metrom-xyz/sdk";
import { useMemo, useState } from "react";
import { allFieldsFilled } from "@/src/utils/form";
import type { CompletedRequiredSteps } from "..";
import { useFormErrors } from "@/src/context/form-errors";

import styles from "./styles.module.css";

interface AmmPoolLiquidityBasicsStepsProps {
    payload: AmmPoolLiquidityCampaignPayload;
    onComplete: (steps: Partial<CompletedRequiredSteps>) => void;
    onApply: (payload: BaseCampaignPayloadPart) => void;
}

const BASIC_PAYLOAD_KEYS: Partial<keyof AmmPoolLiquidityCampaignPayload>[] = [
    "chainId",
    "dex",
    "pool",
    "startDate",
    "endDate",
];

export function AmmPoolLiquidityBasicsSteps({
    payload,
    onComplete,
    onApply,
}: AmmPoolLiquidityBasicsStepsProps) {
    const [basicsPayload, setBasicsPayload] = useState(
        Object.fromEntries(
            BASIC_PAYLOAD_KEYS.map((key) => [key, payload[key]]),
        ) as Pick<
            typeof payload,
            Partial<keyof AmmPoolLiquidityCampaignPayload>
        >,
    );

    const t = useTranslations("newCampaign");
    const { errors, updateErrors } = useFormErrors();

    const unsavedChanges = useMemo(() => {
        if (
            !allFieldsFilled(basicsPayload, BASIC_PAYLOAD_KEYS) &&
            allFieldsFilled(payload, BASIC_PAYLOAD_KEYS)
        )
            return true;
        return BASIC_PAYLOAD_KEYS.some(
            (key) => basicsPayload[key] !== payload[key],
        );
    }, [payload, basicsPayload]);

    const applyDisabled =
        !!errors.basics ||
        !unsavedChanges ||
        !allFieldsFilled(basicsPayload, BASIC_PAYLOAD_KEYS);

    const completed =
        !errors.basics &&
        !unsavedChanges &&
        allFieldsFilled(basicsPayload, BASIC_PAYLOAD_KEYS);

    function handlePayloadOnChange(part: AmmPoolLiquidityCampaignPayloadPart) {
        setBasicsPayload((prev) => ({ ...prev, ...part }));
    }

    return (
        <CampaignBasicsStep
            payload={basicsPayload}
            startDatePickerDisabled={!basicsPayload.pool}
            applyDisabled={applyDisabled}
            completed={!!completed}
            unsavedChanges={unsavedChanges}
            onComplete={onComplete}
            onApply={onApply}
            onChange={handlePayloadOnChange}
            targetSection={
                <StepSection title={t("defineTarget")}>
                    <div className={styles.target}>
                        <ChainSelect
                            campaignType={BaseCampaignType.AmmPoolLiquidity}
                            value={basicsPayload.chainId}
                            onChange={handlePayloadOnChange}
                        />
                        <DexSelect
                            chainId={basicsPayload.chainId}
                            value={basicsPayload.dex}
                            resetTrigger={basicsPayload.chainId}
                            onChange={handlePayloadOnChange}
                        />
                        <PoolSelect
                            chainId={basicsPayload.chainId}
                            dex={basicsPayload.dex}
                            pool={basicsPayload.pool}
                            resetTrigger={basicsPayload.dex}
                            onChange={handlePayloadOnChange}
                            onError={updateErrors}
                        />
                    </div>
                </StepSection>
            }
        />
    );
}
