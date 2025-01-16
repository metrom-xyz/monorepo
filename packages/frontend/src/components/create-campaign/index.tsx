"use client";

import { useChainId } from "wagmi";
import {
    CampaignPreviewPayload,
    type CampaignPayload,
    type CampaignPayloadErrors,
    type CampaignPayloadPart,
    type CampaignPreviewPointDistributables,
    type CampaignPreviewTokenDistributables,
} from "@/src/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Button } from "@metrom-xyz/ui";
import { CreateCampaignForm } from "./form";
import { CampaignPreview } from "./preview";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useTranslations } from "next-intl";
import { trackFathomEvent } from "@/src/utils/fathom";
import { DistributablesType } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

export enum View {
    Form = "form",
    Preview = "preview",
}

function validatePayload(
    payload: CampaignPayload,
): CampaignPreviewPayload | null {
    if (!payload.dex || !payload.pool || !payload.startDate || !payload.endDate)
        return null;

    let distributables;
    if (payload.points && payload.fee) {
        distributables = {
            type: DistributablesType.Points,
            fee: payload.fee,
            points: payload.points,
        } as CampaignPreviewPointDistributables;
    } else if (payload.tokens && payload.tokens.length > 0) {
        distributables = {
            type: DistributablesType.Tokens,
            tokens: payload.tokens,
        } as CampaignPreviewTokenDistributables;
    } else return null;

    return new CampaignPreviewPayload(
        payload.dex,
        payload.pool,
        payload.startDate,
        payload.endDate,
        distributables,
        payload.kpiSpecification,
        payload.restrictions,
    );
}

export function CreateCampaign() {
    const t = useTranslations("newCampaign");

    const [payload, setPayload] = useState<CampaignPayload>({});
    const [payloadErrors, setPayloadErrors] = useState<CampaignPayloadErrors>(
        {},
    );
    const [view, setView] = useState<View>(View.Form);

    const chainId = useChainId();

    const previewPayload = useMemo(() => {
        if (Object.values(payloadErrors).some((error) => !!error)) return null;
        return validatePayload(payload);
    }, [payload, payloadErrors]);

    useEffect(() => {
        setPayload({});
    }, [chainId]);

    useEffect(() => {
        setPayload({ dex: payload.dex });
    }, [payload.dex]);

    function handlePayloadOnChange(part: CampaignPayloadPart) {
        setPayload((prev) => ({ ...prev, ...part }));
    }

    const handlePayloadOnError = useCallback(
        (errors: CampaignPayloadErrors) => {
            setPayloadErrors((state) => ({ ...state, ...errors }));
        },
        [],
    );

    function handlePreviewOnClick() {
        setView(View.Preview);
        trackFathomEvent("CLICK_CAMPAIGN_PREVIEW");
    }

    function handleBackOnClick() {
        setView(View.Form);
    }

    function handleCreateNewOnClick() {
        setPayload((prevState) => ({
            ...prevState,
            pool: undefined,
            tokens: undefined,
            points: undefined,
            feeToken: undefined,
            kpiSpecification: undefined,
        }));
        setPayloadErrors({});
        setView(View.Form);
    }

    return (
        <div className={styles.root}>
            <CreateCampaignForm
                payload={payload}
                onPayloadChange={handlePayloadOnChange}
                onPayloadError={handlePayloadOnError}
            />
            <Button
                icon={ArrowRightIcon}
                iconPlacement="right"
                disabled={!previewPayload}
                className={{ root: styles.button }}
                onClick={handlePreviewOnClick}
            >
                {t("submit.preview")}
            </Button>
            {previewPayload && (
                <Modal open={view === View.Preview}>
                    <CampaignPreview
                        onBack={handleBackOnClick}
                        onCreateNew={handleCreateNewOnClick}
                        payload={previewPayload}
                    />
                </Modal>
            )}
        </div>
    );
}
