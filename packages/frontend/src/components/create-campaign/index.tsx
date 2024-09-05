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
import { Button } from "@/src/ui/button";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { useTranslations } from "next-intl";

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
