import { ChainSelect } from "../../inputs/chain-select";
import { CampaignBasicsStep } from "../../steps/campaign-basics-step";
import { StepSection } from "../step-section";
import type {
    BaseCampaignPayloadPart,
    CampaignPayloadErrors,
} from "@/src/types/campaign/common";
import { useTranslations } from "next-intl";
import { BaseCampaignType } from "@metrom-xyz/sdk";
import { useMemo, useState } from "react";
import type {
    AaveV3CampaignPayload,
    AaveV3CampaignPayloadPart,
} from "@/src/types/campaign/aave-v3-campaign";
import { KindSelect } from "../../inputs/kind-select";
import { AAVE_V3_CAMPAIGN_KIND_OPTIONS } from ".";
import { AaveV3BrandSelect } from "../../inputs/aave-v3-brand-select";
import { AaveV3CollateralSelect } from "../../inputs/aave-v3-collateral-select";
import { AaveV3MarketSelect } from "../../inputs/aave-v3-market-select";
import { allFieldsFilled } from "@/src/utils/form";

import styles from "./styles.module.css";

interface BasicsStepsProps {
    payload: AaveV3CampaignPayload;
    error?: string;
    onApply: (payload: BaseCampaignPayloadPart) => void;
    onError: (errors: CampaignPayloadErrors) => void;
}

const BASIC_PAYLOAD_KEYS: Partial<keyof AaveV3CampaignPayload>[] = [
    "chainId",
    "brand",
    "market",
    "kind",
    "collateral",
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
        ) as Pick<typeof payload, Partial<keyof AaveV3CampaignPayload>>,
    );

    const t = useTranslations("newCampaign");

    const unsavedChanges = useMemo(() => {
        if (!allFieldsFilled(payload, BASIC_PAYLOAD_KEYS)) return true;
        return BASIC_PAYLOAD_KEYS.some(
            (key) => basicsPayload[key] !== payload[key],
        );
    }, [payload, basicsPayload]);

    const kindOptions = AAVE_V3_CAMPAIGN_KIND_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
    }));

    const applyDisabled =
        !!error ||
        !unsavedChanges ||
        !allFieldsFilled(basicsPayload, BASIC_PAYLOAD_KEYS);

    const completed =
        !error &&
        !unsavedChanges &&
        allFieldsFilled(basicsPayload, BASIC_PAYLOAD_KEYS);

    function handlePayloadOnChange(part: AaveV3CampaignPayloadPart) {
        setBasicsPayload((prev) => ({ ...prev, ...part }));
    }

    return (
        <CampaignBasicsStep
            payload={basicsPayload}
            startDatePickerDisabled={!basicsPayload.collateral}
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
                        <div className={styles.row}>
                            <ChainSelect
                                campaignType={BaseCampaignType.AaveV3}
                                value={basicsPayload.chainId}
                                onChange={handlePayloadOnChange}
                            />
                            <AaveV3BrandSelect
                                chainId={basicsPayload.chainId}
                                value={basicsPayload.brand}
                                onChange={handlePayloadOnChange}
                            />
                            <AaveV3MarketSelect
                                chainId={basicsPayload.chainId}
                                brand={basicsPayload.brand}
                                value={basicsPayload.market}
                                onChange={handlePayloadOnChange}
                            />
                        </div>
                        <div className={styles.row}>
                            <KindSelect
                                label={t("form.aaveV3.action")}
                                kinds={kindOptions}
                                value={basicsPayload.kind}
                                disabled={!basicsPayload.brand}
                                messages={{
                                    noResults: t("form.aaveV3.noActions"),
                                }}
                                onChange={handlePayloadOnChange}
                            />
                            <AaveV3CollateralSelect
                                chainId={basicsPayload.chainId}
                                brand={basicsPayload.brand}
                                market={basicsPayload.market}
                                kind={basicsPayload.kind}
                                value={basicsPayload.collateral}
                                onChange={handlePayloadOnChange}
                            />
                        </div>
                    </div>
                </StepSection>
            }
        />
    );
}
