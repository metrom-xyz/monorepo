import { ChainSelect } from "../../inputs/chain-select";
import { CampaignBasicsStep } from "../../steps/campaign-basics-step";
import { StepSection } from "../step-section";
import type { BaseCampaignPayloadPart } from "@/src/types/campaign/common";
import { useTranslations } from "next-intl";
import { BaseCampaignType } from "@metrom-xyz/sdk";
import { useMemo, useState } from "react";
import { allFieldsFilled } from "@/src/utils/form";
import { useFormSteps } from "@/src/context/form-steps";
import type { FormStepId } from "@/src/types/form";
import type {
    HoldFungibleAssetCampaignPayload,
    HoldFungibleAssetCampaignPayloadPart,
} from "@/src/types/campaign/hold-fungible-asset-campaign";
import { FungibleAssetPicker } from "../../inputs/fungible-asset-picker";

import styles from "./styles.module.css";

interface HoldFungibleAssetBasicsStepProps {
    payload: HoldFungibleAssetCampaignPayload;
    onApply: (payload: BaseCampaignPayloadPart, stepId: FormStepId) => void;
}

export const HOLD_FUNGIBLE_ASSET_BASIC_PAYLOAD_KEYS: Partial<
    keyof HoldFungibleAssetCampaignPayload
>[] = ["chainId", "asset", "startDate", "endDate"];

export function HoldFungibleAssetBasicsStep({
    payload,
    onApply,
}: HoldFungibleAssetBasicsStepProps) {
    const [basicsPayload, setBasicsPayload] = useState(
        Object.fromEntries(
            HOLD_FUNGIBLE_ASSET_BASIC_PAYLOAD_KEYS.map((key) => [
                key,
                payload[key],
            ]),
        ) as Pick<
            typeof payload,
            Partial<keyof HoldFungibleAssetCampaignPayload>
        >,
    );

    const t = useTranslations("newCampaign");
    const { errors } = useFormSteps();

    const unsavedChanges = useMemo(() => {
        if (
            !allFieldsFilled(
                basicsPayload,
                HOLD_FUNGIBLE_ASSET_BASIC_PAYLOAD_KEYS,
            ) &&
            allFieldsFilled(payload, HOLD_FUNGIBLE_ASSET_BASIC_PAYLOAD_KEYS)
        )
            return true;
        return HOLD_FUNGIBLE_ASSET_BASIC_PAYLOAD_KEYS.some(
            (key) => basicsPayload[key] !== payload[key],
        );
    }, [payload, basicsPayload]);

    const applyDisabled =
        !!errors.basics ||
        !unsavedChanges ||
        !allFieldsFilled(basicsPayload, HOLD_FUNGIBLE_ASSET_BASIC_PAYLOAD_KEYS);

    const completed =
        !errors.basics &&
        !unsavedChanges &&
        allFieldsFilled(basicsPayload, HOLD_FUNGIBLE_ASSET_BASIC_PAYLOAD_KEYS);

    function handlePayloadOnChange(part: HoldFungibleAssetCampaignPayloadPart) {
        setBasicsPayload((prev) => ({ ...prev, ...part }));
    }

    return (
        <CampaignBasicsStep
            payload={basicsPayload}
            startDatePickerDisabled={!basicsPayload.asset}
            applyDisabled={applyDisabled}
            completed={!!completed}
            unsavedChanges={unsavedChanges}
            onApply={onApply}
            onChange={handlePayloadOnChange}
            targetSection={
                <StepSection title={t("defineTarget")}>
                    <div className={styles.target}>
                        <ChainSelect
                            campaignType={BaseCampaignType.HoldFungibleAsset}
                            value={basicsPayload.chainId}
                            onChange={handlePayloadOnChange}
                        />
                        <FungibleAssetPicker
                            chainId={basicsPayload.chainId}
                            asset={basicsPayload.asset}
                            disabled={!basicsPayload.chainId}
                            onChange={handlePayloadOnChange}
                        />
                    </div>
                </StepSection>
            }
        />
    );
}
