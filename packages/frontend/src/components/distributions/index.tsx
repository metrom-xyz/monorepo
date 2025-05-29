"use client";

import { useDistributions } from "@/src/hooks/useDistributions";
import { DateTimePicker, TextInput } from "@metrom-xyz/ui";
import type { Dayjs } from "dayjs";
import { useState, type ChangeEvent } from "react";

import styles from "./styles.module.css";

export function Distributions() {
    const [campaignId, setCampaignId] = useState<string>();
    const [from, setFrom] = useState<Dayjs | undefined>();
    const [to, setTo] = useState<Dayjs | undefined>();

    const { distributions } = useDistributions({
        campaignId,
        from,
        to,
    });

    function handleCampaignIdOnChange(event: ChangeEvent<HTMLInputElement>) {
        setCampaignId(event.target.value);
    }

    return (
        <div className={styles.root}>
            <TextInput
                label="Campaign id"
                value={campaignId}
                onChange={handleCampaignIdOnChange}
            />
            <div className={styles.datePickersWrapper}>
                <DateTimePicker
                    value={from}
                    range={{ from, to }}
                    onChange={setFrom}
                />
                <DateTimePicker
                    value={to}
                    range={{ from, to }}
                    onChange={setTo}
                />
            </div>
        </div>
    );
}
