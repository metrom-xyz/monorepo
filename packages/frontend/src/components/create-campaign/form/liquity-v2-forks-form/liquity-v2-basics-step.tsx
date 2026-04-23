import type { BaseCampaignPayloadPart } from "@/src/types/campaign/common";
import type {
    LiquityV2CampaignPayload,
    LiquityV2CampaignPayloadPart,
} from "@/src/types/campaign/liquity-v2-campaign";
import type { FormStepId } from "@/src/types/form";
import { useMemo, useState } from "react";
import { useFormSteps } from "@/src/context/form-steps";
import { allFieldsFilled } from "@/src/utils/form";
import type { CampaignKindOption } from "../../steps/campaign-kind-step";
import type { TranslationsKeys } from "@/src/types/utils";
import { BaseCampaignType, CampaignKind } from "@metrom-xyz/sdk";
import { CampaignBasicsStep } from "../../steps/campaign-basics-step";
import { FormStepSection } from "../../form-step-section";
import { ChainSelect } from "../../inputs/chain-select";
import { useTranslations } from "next-intl";
import { KindSelect } from "../../inputs/kind-select";
import { LiquityV2BrandSelect } from "../../inputs/liquity-v2-brand-select";
import { LiquityV2CollateralSelect } from "../../inputs/liquity-v2-collateral-select";

import styles from "./styles.module.css";

interface LiquidtyV2BasicsStepProps {
    payload: LiquityV2CampaignPayload;
    onApply: (payload: BaseCampaignPayloadPart, stepId: FormStepId) => void;
}

const KIND_OPTIONS: CampaignKindOption<TranslationsKeys<"newCampaign">>[] = [
    {
        label: "form.liquityV2.actions.borrow",
        value: CampaignKind.LiquityV2Debt,
    },
    {
        label: "form.liquityV2.actions.depositToStabilityPool",
        value: CampaignKind.LiquityV2StabilityPool,
    },
] as const;

export const LIQUITY_V2_BASIC_PAYLOAD_KEYS: Partial<keyof LiquityV2CampaignPayload>[] = [
    "chainId",
    "brand",
    "kind",
    "collateral",
    "startDate",
    "endDate",
];

export function LiquityV2BasicsStep({
    payload,
    onApply,
}: LiquidtyV2BasicsStepProps) {
    const [basicsPayload, setBasicsPayload] = useState(
        Object.fromEntries(
            LIQUITY_V2_BASIC_PAYLOAD_KEYS.map((key) => [key, payload[key]]),
        ) as Pick<typeof payload, Partial<keyof LiquityV2CampaignPayload>>,
    );

    const t = useTranslations("newCampaign");
    const { errors } = useFormSteps();

    const unsavedChanges = useMemo(() => {
        if (
            !allFieldsFilled(basicsPayload, LIQUITY_V2_BASIC_PAYLOAD_KEYS) &&
            allFieldsFilled(payload, LIQUITY_V2_BASIC_PAYLOAD_KEYS)
        )
            return true;
        return LIQUITY_V2_BASIC_PAYLOAD_KEYS.some(
            (key) => basicsPayload[key] !== payload[key],
        );
    }, [payload, basicsPayload]);

    const kindOptions = useMemo(() => {
        return KIND_OPTIONS.map((option) => ({
            ...option,
            label: t(option.label, {
                debtToken: basicsPayload.brand?.debtToken.symbol || "",
            }),
        }));
    }, [basicsPayload.brand?.debtToken.symbol, t]);

    const applyDisabled =
        !!errors.basics ||
        !unsavedChanges ||
        !allFieldsFilled(basicsPayload, LIQUITY_V2_BASIC_PAYLOAD_KEYS);

    const completed =
        !errors.basics &&
        !unsavedChanges &&
        allFieldsFilled(basicsPayload, LIQUITY_V2_BASIC_PAYLOAD_KEYS);

    function handlePayloadOnChange(part: LiquityV2CampaignPayloadPart) {
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
                    <FormStepSection title={t("defineTarget")}>
                        <div className={styles.target}>
                            <ChainSelect
                                campaignType={BaseCampaignType.LiquityV2}
                                value={basicsPayload.chainId}
                                onChange={handlePayloadOnChange}
                            />
                            <LiquityV2BrandSelect
                                chainId={basicsPayload.chainId}
                                value={basicsPayload.brand}
                                onChange={handlePayloadOnChange}
                            />
                            <KindSelect
                                label={t("form.liquityV2.action")}
                                kinds={kindOptions}
                                value={basicsPayload.kind}
                                disabled={!basicsPayload.brand}
                                messages={{
                                    noResults: t("form.liquityV2.noActions"),
                                }}
                                onChange={handlePayloadOnChange}
                            />
                            <LiquityV2CollateralSelect
                                chainId={basicsPayload.chainId}
                                brand={basicsPayload.brand}
                                kind={basicsPayload.kind}
                                value={basicsPayload.collateral}
                                onChange={handlePayloadOnChange}
                            />
                        </div>
                    </FormStepSection>
                </div>
            }
        />
    );
}
