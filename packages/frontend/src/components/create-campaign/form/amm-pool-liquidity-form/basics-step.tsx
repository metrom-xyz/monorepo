import type {
    AmmPoolLiquidityCampaignPayload,
    AmmPoolLiquidityCampaignPayloadPart,
} from "@/src/types/campaign/amm-pool-liquidity-campaign";
import { ChainSelect } from "../../inputs/chain-select";
import { DexSelect } from "../../inputs/dex-select";
import { PoolSelect } from "../../inputs/pool-select";
import { CampaignBasicsStep } from "../../steps/campaign-basics-step";
import { StepSection } from "../step-section";
import type {
    BaseCampaignPayloadPart,
    CampaignPayloadErrors,
} from "@/src/types/campaign/common";
import { useTranslations } from "next-intl";
import { BaseCampaignType } from "@metrom-xyz/sdk";
import { useMemo, useState } from "react";
import { allFieldsFilled } from "@/src/utils/form";

import styles from "./styles.module.css";

interface BasicsStepsProps {
    payload: AmmPoolLiquidityCampaignPayload;
    error?: string;
    onApply: (payload: BaseCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

const BASIC_PAYLOAD_KEYS: Partial<keyof AmmPoolLiquidityCampaignPayload>[] = [
    "chainId",
    "dex",
    "pool",
    "startDate",
    "endDate",
];

export function BasicsSteps({
    payload,
    error,
    onApply,
    onError,
}: BasicsStepsProps) {
    const [basicsPayload, setBasicsPayload] = useState(
        Object.fromEntries(
            BASIC_PAYLOAD_KEYS.map((key) => [key, payload[key]]),
        ) as Pick<
            typeof payload,
            Partial<keyof AmmPoolLiquidityCampaignPayload>
        >,
    );

    const t = useTranslations("newCampaign");

    const unsavedChanges = useMemo(() => {
        if (!allFieldsFilled(payload, BASIC_PAYLOAD_KEYS)) return true;
        return BASIC_PAYLOAD_KEYS.some(
            (key) => basicsPayload[key] !== payload[key],
        );
    }, [payload, basicsPayload]);

    function handlePayloadOnChange(part: AmmPoolLiquidityCampaignPayloadPart) {
        setBasicsPayload((prev) => ({ ...prev, ...part }));
    }

    const applyDisabled =
        !!error ||
        !unsavedChanges ||
        !allFieldsFilled(basicsPayload, BASIC_PAYLOAD_KEYS);

    const completed =
        !error &&
        !unsavedChanges &&
        allFieldsFilled(basicsPayload, BASIC_PAYLOAD_KEYS);

    return (
        <CampaignBasicsStep
            payload={basicsPayload}
            startDatePickerDisabled={!basicsPayload.pool}
            applyDisabled={applyDisabled}
            error={error}
            completed={!!completed}
            unsavedChanges={unsavedChanges}
            onApply={onApply}
            onError={onError}
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
                            onError={onError}
                        />
                    </div>
                </StepSection>
            }
        />
    );
}
