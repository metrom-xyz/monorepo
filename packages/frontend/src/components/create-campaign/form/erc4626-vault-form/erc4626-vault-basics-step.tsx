import { ChainSelect } from "../../inputs/chain-select";
import { CampaignBasicsStep } from "../../steps/campaign-basics-step";
import { FormStepSection } from "../../form-step-section";
import type { BaseCampaignPayloadPart } from "@/src/types/campaign/common";
import { useTranslations } from "next-intl";
import { BaseCampaignType } from "@metrom-xyz/sdk";
import { useMemo, useState } from "react";
import { allFieldsFilled } from "@/src/utils/form";
import { useFormSteps } from "@/src/context/form-steps";
import type { FormStepId } from "@/src/types/form";
import type {
    Erc4626VaultCampaignPayload,
    Erc4626VaultCampaignPayloadPart,
} from "@/src/types/campaign/erc4626-vault-campaign";
import { Erc4626VaultBrandSelect } from "../../inputs/erc4626-vault-brand-select";
import { Erc4626VaultSelect } from "../../inputs/erc4626-vault-select";

import styles from "./styles.module.css";

interface Erc4626VaultBasicsStepProps {
    payload: Erc4626VaultCampaignPayload;
    onApply: (payload: BaseCampaignPayloadPart, stepId: FormStepId) => void;
}

export const ERC4626_VAULT_BASIC_PAYLOAD_KEYS: Partial<
    keyof Erc4626VaultCampaignPayload
>[] = ["chainId", "brand", "vault", "startDate", "endDate"];

export function Erc4626VaultBasicsStep({
    payload,
    onApply,
}: Erc4626VaultBasicsStepProps) {
    const [basicsPayload, setBasicsPayload] = useState(
        Object.fromEntries(
            ERC4626_VAULT_BASIC_PAYLOAD_KEYS.map((key) => [key, payload[key]]),
        ) as Pick<typeof payload, Partial<keyof Erc4626VaultCampaignPayload>>,
    );

    const t = useTranslations("newCampaign");
    const { errors } = useFormSteps();

    const unsavedChanges = useMemo(() => {
        if (
            !allFieldsFilled(basicsPayload, ERC4626_VAULT_BASIC_PAYLOAD_KEYS) &&
            allFieldsFilled(payload, ERC4626_VAULT_BASIC_PAYLOAD_KEYS)
        )
            return true;
        return ERC4626_VAULT_BASIC_PAYLOAD_KEYS.some(
            (key) => basicsPayload[key] !== payload[key],
        );
    }, [payload, basicsPayload]);

    const applyDisabled =
        !!errors.basics ||
        !unsavedChanges ||
        !allFieldsFilled(basicsPayload, ERC4626_VAULT_BASIC_PAYLOAD_KEYS);

    const completed =
        !errors.basics &&
        !unsavedChanges &&
        allFieldsFilled(basicsPayload, ERC4626_VAULT_BASIC_PAYLOAD_KEYS);

    function handlePayloadOnChange(part: Erc4626VaultCampaignPayloadPart) {
        setBasicsPayload((prev) => ({ ...prev, ...part }));
    }

    if (!payload.distributables) return null;

    return (
        <CampaignBasicsStep
            payload={basicsPayload}
            startDatePickerDisabled={!basicsPayload.vault}
            applyDisabled={applyDisabled}
            completed={!!completed}
            unsavedChanges={unsavedChanges}
            onApply={onApply}
            onChange={handlePayloadOnChange}
            targetSection={
                <FormStepSection title={t("defineTarget")}>
                    <div className={styles.target}>
                        <ChainSelect
                            campaignType={BaseCampaignType.Erc4626Vault}
                            distributablesType={payload.distributables.type}
                            value={basicsPayload.chainId}
                            onChange={handlePayloadOnChange}
                        />
                        <Erc4626VaultBrandSelect
                            value={basicsPayload.brand}
                            chainId={basicsPayload.chainId}
                            resetTrigger={basicsPayload.chainId}
                            onChange={handlePayloadOnChange}
                        />
                        <Erc4626VaultSelect
                            vault={basicsPayload.vault}
                            chainId={basicsPayload.chainId}
                            brand={basicsPayload.brand}
                            resetTrigger={basicsPayload.brand}
                            onChange={handlePayloadOnChange}
                        />
                    </div>
                </FormStepSection>
            }
        />
    );
}
