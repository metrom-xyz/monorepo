"use client";

import type { CampaignPayload } from "@/src/types";
import { useEffect, useState } from "react";
import { CreateCampaignForm } from "./form";
import { Summary } from "./summary";

import styles from "./styles.module.css";

enum View {
    form = "form",
    summary = "summary",
}

export function CreateCampaign() {
    const [payloads, setPayloads] = useState<CampaignPayload[]>([{}]);
    const [view, setView] = useState<View>(View.form);

    function handlePayloadOnChange(
        updatedPayload: CampaignPayload,
        payloadIndex: number,
    ) {
        setPayloads(
            payloads.map((payload, index) => {
                if (index !== payloadIndex) return payload;
                return { ...payload, ...updatedPayload };
            }),
        );
    }

    // TODO: remove
    useEffect(() => {
        console.log(JSON.stringify(payloads, null, 4));
    }, [payloads]);

    return (
        <div className={styles.root}>
            {view === View.form &&
                payloads.map((payload, index) => (
                    <CreateCampaignForm
                        key={index}
                        payloadIndex={index}
                        payload={payload}
                        onPayloadChange={handlePayloadOnChange}
                    />
                ))}
            {view === View.summary && <Summary />}
        </div>
    );
}
