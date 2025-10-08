import {
    type CampaignPayloadErrors,
    type CampaignPreviewDistributables,
    EmptyTargetCampaignPreviewPayload,
    type HoldTokenCampaignPayload,
    HoldTokenCampaignPreviewPayload,
    type HoldTokenCampaignPayloadPart,
} from "@/src/types/campaign";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { CampaignKind, DistributablesType } from "@metrom-xyz/sdk";
import { StartDateStep } from "../../steps/start-date-step";
import { EndDateStep } from "../../steps/end-date-step";
import { RewardsStep } from "../../steps/rewards-step";
import { RestrictionsStep } from "../../steps/restrictions-step";
import { Button } from "@metrom-xyz/ui";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { EXPERIMENTAL_CHAINS } from "@/src/commons/env";
import { validateDistributables } from "@/src/utils/creation-form";
import { HoldTokenPickerStep } from "../../steps/hold-token-picker-step";

import styles from "./styles.module.css";

function validatePayload(
    chainId: number,
    payload: HoldTokenCampaignPayload,
): HoldTokenCampaignPreviewPayload | EmptyTargetCampaignPreviewPayload | null {
    const {
        kind,
        token,
        stakingTokens,
        startDate,
        endDate,
        distributables,
        kpiSpecification,
        restrictions,
    } = payload;

    if (!kind || !token || !startDate || !endDate || !distributables)
        return null;

    if (!validateDistributables(distributables)) return null;

    // TODO: handle chain type for same chain ids?
    if (EXPERIMENTAL_CHAINS.includes(chainId)) {
        return new EmptyTargetCampaignPreviewPayload(
            startDate,
            endDate,
            distributables as CampaignPreviewDistributables,
            kpiSpecification,
            restrictions,
        );
    }

    return new HoldTokenCampaignPreviewPayload(
        token,
        stakingTokens,
        startDate,
        endDate,
        distributables as CampaignPreviewDistributables,
        kpiSpecification,
        restrictions,
    );
}

interface HoldTokenFormProps {
    unsupportedChain: boolean;
    onPreviewClick: (
        payload:
            | HoldTokenCampaignPreviewPayload
            | EmptyTargetCampaignPreviewPayload
            | null,
    ) => void;
}

const initialPayload: HoldTokenCampaignPayload = {
    distributables: { type: DistributablesType.Tokens },
    kind: CampaignKind.HoldToken,
    stakingTokens: [],
};

export function HoldTokenForm({
    unsupportedChain,
    onPreviewClick,
}: HoldTokenFormProps) {
    const t = useTranslations("newCampaign");
    const { id: chainId } = useChainWithType();

    const [payload, setPayload] = useState(initialPayload);
    const [errors, setErrors] = useState<CampaignPayloadErrors>({});

    const previewPayload = useMemo(() => {
        if (Object.values(errors).some((error) => !!error)) return null;
        return validatePayload(chainId, payload);
    }, [chainId, payload, errors]);

    const noDistributables = useMemo(() => {
        if (!payload.distributables) return true;
        return !validateDistributables(payload.distributables);
    }, [payload.distributables]);

    useEffect(() => {
        setPayload(initialPayload);
    }, [chainId]);

    const handlePayloadOnChange = useCallback(
        (part: HoldTokenCampaignPayloadPart) => {
            setPayload((prev) => ({ ...prev, ...part }));
        },
        [],
    );

    const handlePayloadOnError = useCallback(
        (errors: CampaignPayloadErrors) => {
            setErrors((state) => ({ ...state, ...errors }));
        },
        [],
    );

    function handlePreviewOnClick() {
        onPreviewClick(previewPayload);
    }

    return (
        <div className={styles.root}>
            <div className={styles.stepsWrapper}>
                <HoldTokenPickerStep
                    disabled={unsupportedChain}
                    token={payload.token}
                    stakingTokens={payload.stakingTokens}
                    onTokensChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <StartDateStep
                    disabled={!payload.token || unsupportedChain}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    onStartDateChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <EndDateStep
                    disabled={!payload.startDate || unsupportedChain}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    onEndDateChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <RewardsStep
                    disabled={!payload.endDate || unsupportedChain}
                    distributables={payload.distributables}
                    startDate={payload.startDate}
                    endDate={payload.endDate}
                    onDistributablesChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
                <RestrictionsStep
                    disabled={
                        !payload.token || noDistributables || unsupportedChain
                    }
                    restrictions={payload.restrictions}
                    onRestrictionsChange={handlePayloadOnChange}
                    onError={handlePayloadOnError}
                />
            </div>
            <Button
                icon={ArrowRightIcon}
                iconPlacement="right"
                disabled={!previewPayload}
                className={{ root: styles.button }}
                onClick={handlePreviewOnClick}
            >
                {t("submit.preview")}
            </Button>
        </div>
    );
}
