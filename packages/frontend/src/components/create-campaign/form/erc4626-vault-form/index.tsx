import {
    type CampaignPreviewFixedDistribution,
    type CampaignPreviewKpiDistribution,
} from "@/src/types/campaign/common";
import { useCallback, useMemo, useState } from "react";
import { CampaignKind, DistributablesType } from "@metrom-xyz/sdk";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import { EmptyTargetCampaignPreviewPayload } from "@/src/types/campaign/empty-target-campaign";
import {
    allFieldsFilled,
    distributablesCompleted,
    getNextFormStep,
    validateDistributables,
    validateDistributions,
} from "@/src/utils/form";
import { useFormSteps } from "@/src/context/form-steps";
import { FormStepId } from "@/src/types/form";
import { CampaignApproveLaunchStep } from "../../steps/campaign-approve-launch-step";
import {
    type Erc4626VaultCampaignPayload,
    type Erc4626VaultCampaignPayloadPart,
    Erc4626VaultCampaignPreviewPayload,
} from "@/src/types/campaign/erc4626-vault-campaign";
import {
    ERC4626_VAULT_BASIC_PAYLOAD_KEYS,
    Erc4626VaultBasicsStep,
} from "./erc4626-vault-basics-step";
import { Erc4626VaultRewardsStep } from "./erc4626-vault-rewards-step";

import styles from "./styles.module.css";
import { CampaignKpiStep } from "../../steps/campaign-kpi-step";

function validatePayload(
    chainId: number,
    payload: Erc4626VaultCampaignPayload,
):
    | Erc4626VaultCampaignPreviewPayload
    | EmptyTargetCampaignPreviewPayload
    | null {
    const {
        kind,
        brand,
        vault,
        startDate,
        endDate,
        distributables,
        kpiDistribution,
        fixedDistribution,
        restrictions,
    } = payload;

    if (
        !kind ||
        !brand ||
        !vault ||
        !startDate ||
        !endDate ||
        !distributables ||
        kind !== CampaignKind.Erc4626Vault
    )
        return null;

    if (!validateDistributables(distributables)) return null;
    if (!validateDistributions(kpiDistribution, fixedDistribution)) return null;

    // TODO: handle chain type for same chain ids?
    if (EXPERIMENTAL_CHAINS.includes(chainId)) {
        return new EmptyTargetCampaignPreviewPayload(
            chainId,
            startDate,
            endDate,
            distributables,
            kpiDistribution as CampaignPreviewKpiDistribution,
            fixedDistribution as CampaignPreviewFixedDistribution,
            restrictions,
        );
    }

    return new Erc4626VaultCampaignPreviewPayload(
        brand,
        vault,
        chainId,
        startDate,
        endDate,
        distributables,
        kpiDistribution as CampaignPreviewKpiDistribution,
        fixedDistribution as CampaignPreviewFixedDistribution,
        restrictions,
    );
}

interface Erc4626VaultFormProps {
    distributablesType: DistributablesType;
    onStepComplete: (payload: Erc4626VaultCampaignPayloadPart) => void;
    onLaunch: () => void;
}

export function Erc4626VaultForm({
    distributablesType,
    onStepComplete,
    onLaunch,
}: Erc4626VaultFormProps) {
    const [payload, setPayload] = useState<Erc4626VaultCampaignPayload>({
        kind: CampaignKind.Erc4626Vault,
        distributables: { type: distributablesType },
    });

    const { errors, unsaved, activeStepId, updateActiveStepId } =
        useFormSteps();

    const validatedPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error) || !payload.chainId)
            return null;
        return validatePayload(payload.chainId, payload);
    }, [payload, errors]);

    const steps: FormStepId[] = useMemo(
        () => [
            FormStepId.Basics,
            FormStepId.Rewards,
            ...(distributablesType === DistributablesType.Tokens
                ? [FormStepId.Kpi]
                : []),
            FormStepId.Launch,
        ],
        [distributablesType],
    );

    const handleOnApply = useCallback(
        (part: Erc4626VaultCampaignPayloadPart, stepId: FormStepId) => {
            setPayload((prev) => ({ ...prev, ...part }));

            const newPayload = { ...payload, ...part };
            onStepComplete({ ...payload, ...part });

            const next = getNextFormStep(steps, activeStepId, stepId, newPayload);
            if (!next) return;

            updateActiveStepId(next);
        },
        [activeStepId, payload, steps, onStepComplete, updateActiveStepId],
    );

    const unsavedSteps = Object.values(unsaved).some((item) => !!item);

    return (
        <div className={styles.root}>
            <div className={styles.stepsWrapper}>
                <Erc4626VaultBasicsStep
                    payload={payload}
                    onApply={handleOnApply}
                />
                <Erc4626VaultRewardsStep
                    payload={payload}
                    disabled={
                        !!errors.basics ||
                        !allFieldsFilled(
                            payload,
                            ERC4626_VAULT_BASIC_PAYLOAD_KEYS,
                        )
                    }
                    onApply={handleOnApply}
                />
                <CampaignKpiStep
                    payload={payload}
                    targetUsdValue={payload.vault?.usdTvl}
                    disabled={
                        !!errors.rewards || !distributablesCompleted(payload)
                    }
                    onApply={handleOnApply}
                />
                <CampaignApproveLaunchStep
                    payload={validatedPayload}
                    disabled={
                        unsavedSteps ||
                        !validatedPayload ||
                        !!Object.values(errors).some((error) => !!error) ||
                        !distributablesCompleted(payload)
                    }
                    onLaunch={onLaunch}
                />
            </div>
        </div>
    );
}
