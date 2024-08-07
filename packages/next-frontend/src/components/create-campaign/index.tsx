"use client";

import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";
import { useEffect, useState } from "react";
import { CreateCampaignForm } from "./form";
import { Summary } from "./summary";

import styles from "./styles.module.css";
import { useChainId } from "wagmi";

enum View {
    form = "form",
    summary = "summary",
}

export function CreateCampaign() {
    const [payload, setPayload] = useState<CampaignPayload>({});
    const [view, setView] = useState<View>(View.form);

    const chainId = useChainId();

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
        </div>
    );
}
