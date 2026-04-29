import { ChainSelect } from "../../inputs/chain-select";
import { CampaignBasicsStep } from "../../steps/campaign-basics-step";
import { FormStepSection } from "../../form-step-section";
import type { BaseCampaignPayloadPart } from "@/src/types/campaign/common";
import { useTranslations } from "next-intl";
import { BaseCampaignType, CampaignKind } from "@metrom-xyz/sdk";
import { useMemo, useState } from "react";
import type {
    AaveV3CampaignPayload,
    AaveV3CampaignPayloadPart,
} from "@/src/types/campaign/aave-v3-campaign";
import { KindSelect } from "../../inputs/kind-select";
import { AaveV3BrandSelect } from "../../inputs/aave-v3-brand-select";
import { AaveV3CollateralSelect } from "../../inputs/aave-v3-collateral-select";
import { AaveV3MarketSelect } from "../../inputs/aave-v3-market-select";
import { allFieldsFilled, arraysEqual } from "@/src/utils/form";
import { AaveV3BlockCrossBorrowPicker } from "../../inputs/aave-v3-block-cross-borrow-picker";
import { useFormSteps } from "@/src/context/form-steps";
import { Typography } from "@metrom-xyz/ui";
import type { FormStepId } from "@/src/types/form";
import type { CampaignKindOption } from "../../steps/campaign-kind-step";
import type { TranslationsKeys } from "@/src/types/utils";

import styles from "./styles.module.css";

interface AaveV3BasicsStepProps {
    payload: AaveV3CampaignPayload;
    onApply: (payload: BaseCampaignPayloadPart, stepId: FormStepId) => void;
}

const KIND_OPTIONS: CampaignKindOption<TranslationsKeys<"newCampaign">>[] = [
    {
        label: "form.aaveV3.actions.borrow",
        value: CampaignKind.AaveV3Borrow,
    },
    {
        label: "form.aaveV3.actions.supply",
        value: CampaignKind.AaveV3Supply,
    },
    {
        label: "form.aaveV3.actions.netSupply",
        value: CampaignKind.AaveV3NetSupply,
    },
] as const;

export const AAVE_V3_REQUIRED_PAYLOAD_KEYS: Partial<
    keyof AaveV3CampaignPayload
>[] = [
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

const PAYLOAD_KEYS = [
    ...AAVE_V3_REQUIRED_PAYLOAD_KEYS,
    ...OPTIONAL_PAYLOAD_KEYS,
];

export function AaveV3BasicsStep({ payload, onApply }: AaveV3BasicsStepProps) {
    const [basicsPayload, setBasicsPayload] = useState(
        Object.fromEntries(
            PAYLOAD_KEYS.map((key) => [key, payload[key]]),
        ) as Pick<typeof payload, Partial<keyof AaveV3CampaignPayload>>,
    );

    const t = useTranslations("newCampaign");
    const { errors } = useFormSteps();

    const unsavedChanges = useMemo(() => {
        if (
            !allFieldsFilled(basicsPayload, AAVE_V3_REQUIRED_PAYLOAD_KEYS) &&
            allFieldsFilled(payload, AAVE_V3_REQUIRED_PAYLOAD_KEYS)
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

    const kindOptions = KIND_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label),
    }));

    const applyDisabled =
        !!errors.basics ||
        !unsavedChanges ||
        !allFieldsFilled(basicsPayload, AAVE_V3_REQUIRED_PAYLOAD_KEYS);

    const completed =
        !errors.basics &&
        !unsavedChanges &&
        allFieldsFilled(basicsPayload, AAVE_V3_REQUIRED_PAYLOAD_KEYS);

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
                <div className={styles.basics}>
                    <FormStepSection title={t("defineTarget")}>
                        <div className={styles.target}>
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
                    </FormStepSection>
                    {basicsPayload.kind === CampaignKind.AaveV3NetSupply &&
                        !!basicsPayload.collateral && (
                            <FormStepSection
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
                            </FormStepSection>
                        )}
                </div>
            }
        />
    );
}
