import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";
import { AmmStep } from "./amm-step";

import styles from "./styles.module.css";
import { StartDateStep } from "./start-date-step";
import { EndDateStep } from "./end-date-step";
import { PoolStep } from "./pool-step";

export interface CreateCampaignFormProps {
    payload?: CampaignPayload;
    onPayloadChange: (part: CampaignPayloadPart) => void;
}

export function CreateCampaignForm({
    payload,
    onPayloadChange,
}: CreateCampaignFormProps) {
    return (
        <div className={styles.root}>
            <AmmStep amm={payload?.amm} onAmmChange={onPayloadChange} />
            <PoolStep
                disabled={!payload?.amm}
                amm={payload?.amm}
                pool={payload?.pool}
                onPoolChange={onPayloadChange}
            />
            <StartDateStep
                disabled={!payload?.pool}
                startDate={payload?.startDate}
                onStartDateChange={onPayloadChange}
            />
            <EndDateStep
                disabled={!payload?.startDate}
                endDate={payload?.endDate}
                onEndDateChange={onPayloadChange}
            />
        </div>
    );
}
