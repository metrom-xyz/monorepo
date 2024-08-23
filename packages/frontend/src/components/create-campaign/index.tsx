"use client";

import { useChainId } from "wagmi";
import type {
    CampaignPayload,
    CampaignPayloadErrors,
    CampaignPayloadPart,
} from "@/src/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "@/src/ui/modal";
import { CreateCampaignForm } from "./form";
import { CampaignPreview } from "./preview";
import { ApproveRewardsButton } from "./approve-rewards-button";

import styles from "./styles.module.css";

export enum View {
    form = "form",
    preview = "preview",
}

export function CreateCampaign() {
    const [payload, setPayload] = useState<CampaignPayload>({});
    const [payloadErrors, setPayloadErrors] = useState<CampaignPayloadErrors>(
        {},
    );
    const [view, setView] = useState<View>(View.form);

    const chainId = useChainId();

    // TODO: add complete validation
    const malformedPayload = useMemo(() => {
        return (
            !payload.amm ||
            !payload.pool ||
            !payload.startDate ||
            !payload.endDate ||
            !payload.rewards ||
            payload.rewards.length === 0 ||
            Object.values(payloadErrors).some((error) => !!error)
        );
    }, [
        payload.amm,
        payload.endDate,
        payload.pool,
        payload.rewards,
        payload.startDate,
        payloadErrors,
    ]);

    useEffect(() => {
        setPayload({});
    }, [chainId]);

    // TODO: remove
    useEffect(() => {
        console.log(payload);
    }, [payload]);

    const handlePayloadOnChange = useCallback(
        (part: CampaignPayloadPart) => {
            setPayload({ ...payload, ...part });
        },
        [payload],
    );

    const handlePayloadOnError = useCallback(
        (errors: CampaignPayloadErrors) => {
            setPayloadErrors((state) => ({ ...state, ...errors }));
        },
        [],
    );

    function handlePreviewOnClick() {
        setView(View.preview);
    }

    function handleBackOnClick() {
        setView(View.form);
    }

    return (
        <div className={styles.root}>
            <CreateCampaignForm
                payload={payload}
                onPayloadChange={handlePayloadOnChange}
                onPayloadError={handlePayloadOnError}
            />
            <Modal open={view === View.preview}>
                <CampaignPreview
                    onBack={handleBackOnClick}
                    payload={payload}
                    malformedPayload={malformedPayload}
                />
            </Modal>
            <ApproveRewardsButton
                malformedPayload={malformedPayload}
                payload={payload}
                onPreviewClick={handlePreviewOnClick}
            />
        </div>
    );
}
