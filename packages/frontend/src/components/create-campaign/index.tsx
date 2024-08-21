"use client";

import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import type {
    CampaignPayload,
    CampaignPayloadPart,
    CampaignPayloadErrors,
} from "@/src/types";
import { Button } from "@/src/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CreateCampaignForm } from "./form";
import { Summary } from "./summary";

import styles from "./styles.module.css";

enum View {
    form = "form",
    summary = "summary",
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

    return (
        <div className={styles.root}>
            {view === View.form && (
                <CreateCampaignForm
                    payload={payload}
                    onPayloadChange={handlePayloadOnChange}
                    onPayloadError={handlePayloadOnError}
                />
            )}
            {view === View.summary && <Summary />}
            <Button
                icon={ArrowRightIcon}
                iconPlacement="right"
                disabled={malformedPayload}
                className={{ root: styles.submitButton }}
            >
                {t("submit.preview")}
            </Button>
        </div>
    );
}
