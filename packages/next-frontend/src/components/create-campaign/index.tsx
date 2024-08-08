"use client";

import { useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";
import { Button } from "@/src/ui/button";
import { useEffect, useMemo, useState } from "react";
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
    const [view, setView] = useState<View>(View.form);
    const chainId = useChainId();

    // TODO: add complete validation
    const malformedPayload = useMemo(() => {
        return (
            !payload.amm ||
            !payload.pool ||
            !payload.startDate ||
            !payload.endDate
        );
    }, [payload]);

    useEffect(() => {
        setPayload({});
    }, [chainId]);

    // TODO: remove
    useEffect(() => {
        console.log(JSON.stringify(payload, null, 4));
    }, [payload]);

    function handlePayloadOnChange(part: CampaignPayloadPart) {
        setPayload({ ...payload, ...part });
    }

    return (
        <div className={styles.root}>
            {view === View.form && (
                <CreateCampaignForm
                    payload={payload}
                    onPayloadChange={handlePayloadOnChange}
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
