"use client";

import { useChainId } from "wagmi";
import type {
    CampaignPayload,
    CampaignPayloadErrors,
    CampaignPayloadPart,
} from "@/src/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Button } from "@metrom-xyz/ui";
import { CreateCampaignForm } from "./form";
import { CampaignPreview } from "./preview";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useTranslations } from "next-intl";
import { trackFathomEvent } from "@/src/utils/fathom";

import styles from "./styles.module.css";

export enum View {
    form = "form",
    preview = "preview",
}

export function CreateCampaign() {
    const t = useTranslations("newCampaign");

    const [payload, setPayload] = useState<CampaignPayload>({});
    const [payloadErrors, setPayloadErrors] = useState<CampaignPayloadErrors>(
        {},
    );
    const [view, setView] = useState<View>(View.form);

    const chainId = useChainId();

    const malformedPayload = useMemo(() => {
        return (
            !payload.dex ||
            !payload.pool ||
            !payload.startDate ||
            !payload.endDate ||
            !payload.rewards ||
            payload.rewards.length === 0 ||
            Object.values(payloadErrors).some((error) => !!error)
        );
    }, [
        payload.dex,
        payload.endDate,
        payload.pool,
        payload.rewards,
        payload.startDate,
        payloadErrors,
    ]);

    useEffect(() => {
        setPayload({});
    }, [chainId]);

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
        setView(View.preview);
        trackFathomEvent("CLICK_CAMPAIGN_PREVIEW");
    }

    function handleBackOnClick() {
        setView(View.form);
    }

    function handleCreateNewOnClick() {
        setPayload((prevState) => ({
            ...prevState,
            pool: undefined,
            rewards: undefined,
            kpiSpecification: undefined,
        }));
        setPayloadErrors({});
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
                    onCreateNew={handleCreateNewOnClick}
                    payload={payload}
                    malformedPayload={malformedPayload}
                />
            </Modal>
            <Button
                icon={ArrowRightIcon}
                iconPlacement="right"
                disabled={malformedPayload}
                className={{ root: styles.button }}
                onClick={handlePreviewOnClick}
            >
                {t("submit.preview")}
            </Button>
        </div>
    );
}
