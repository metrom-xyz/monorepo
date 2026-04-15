import { ChainSelect } from "../../inputs/chain-select";
import { CampaignBasicsStep } from "../../steps/campaign-basics-step";
import { StepSection } from "../step-section";
import type { BaseCampaignPayloadPart } from "@/src/types/campaign/common";
import { useTranslations } from "next-intl";
import { BaseCampaignType, CampaignKind } from "@metrom-xyz/sdk";
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
import { allFieldsFilled, arraysEqual } from "@/src/utils/form";
import { AaveV3BlockCrossBorrowPicker } from "../../inputs/aave-v3-block-cross-borrow-picker";
import { useFormSteps } from "@/src/context/form-steps";
import { Typography } from "@metrom-xyz/ui";
import type { FormStepId } from "@/src/types/form";

import styles from "./styles.module.css";

interface AaveV3BasicsStepsProps {
    payload: AaveV3CampaignPayload;
    onApply: (payload: BaseCampaignPayloadPart, stepId: FormStepId) => void;
}

export const REQUIRED_PAYLOAD_KEYS: Partial<keyof AaveV3CampaignPayload>[] = [
    "chainId",
    "brand",
    "market",
    "kind",
    "collateral",
    "startDate",
    "endDate",
];

const OPTIONAL_PAYLOAD_KEYS: Partial<keyof AaveV3CampaignPayload>[] = [
    "blacklistedCollaterals",
];

const PAYLOAD_KEYS = [...REQUIRED_PAYLOAD_KEYS, ...OPTIONAL_PAYLOAD_KEYS];

export function AaveV3BasicsSteps({
    payload,
    onApply,
}: AaveV3BasicsStepsProps) {
    const [basicsPayload, setBasicsPayload] = useState(
        Object.fromEntries(
            PAYLOAD_KEYS.map((key) => [key, payload[key]]),
        ) as Pick<typeof payload, Partial<keyof AaveV3CampaignPayload>>,
    );

    const t = useTranslations("newCampaign");
    const { errors } = useFormSteps();

    const unsavedChanges = useMemo(() => {
        if (
            !allFieldsFilled(basicsPayload, REQUIRED_PAYLOAD_KEYS) &&
            allFieldsFilled(payload, REQUIRED_PAYLOAD_KEYS)
        )
            return true;
        return PAYLOAD_KEYS.some((key) => {
            if (
                Array.isArray(basicsPayload[key]) ||
                Array.isArray(payload[key])
            ) {
                return !arraysEqual(
                    (basicsPayload[key] as unknown[]) || [],
                    (payload[key] as unknown[]) || [],
                );
            }

            return basicsPayload[key] !== payload[key];
        });
    }, [payload, basicsPayload]);

    const kindOptions = AAVE_V3_CAMPAIGN_KIND_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
    }));

    const applyDisabled =
        !!errors.basics ||
        !unsavedChanges ||
        !allFieldsFilled(basicsPayload, REQUIRED_PAYLOAD_KEYS);

    const completed =
        !errors.basics &&
        !unsavedChanges &&
        allFieldsFilled(basicsPayload, REQUIRED_PAYLOAD_KEYS);

    function handlePayloadOnChange(part: AaveV3CampaignPayloadPart) {
        setBasicsPayload((prev) => ({ ...prev, ...part }));
    }

    return (
        <CampaignBasicsStep
            payload={basicsPayload}
            startDatePickerDisabled={!basicsPayload.collateral}
            applyDisabled={applyDisabled}
            completed={!!completed}
            unsavedChanges={unsavedChanges}
            onApply={onApply}
            onChange={handlePayloadOnChange}
            targetSection={
                <div className={styles.target}>
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
                    {basicsPayload.kind === CampaignKind.AaveV3NetSupply &&
                        !!basicsPayload.collateral && (
                            <StepSection
                                optional
                                title={t("form.aaveV3.blockCrossBorrow")}
                                description={
                                    <Typography size="xs" variant="tertiary">
                                        {t(
                                            "form.aaveV3.blockCrossBorrowDescription",
                                        )}
                                    </Typography>
                                }
                            >
                                <AaveV3BlockCrossBorrowPicker
                                    chainId={basicsPayload.chainId}
                                    brand={basicsPayload.brand}
                                    market={basicsPayload.market}
                                    collateral={basicsPayload.collateral}
                                    value={basicsPayload.blacklistedCollaterals}
                                    onChange={handlePayloadOnChange}
                                />
                            </StepSection>
                        )}
                </div>
            }
        />
    );
}
