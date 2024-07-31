import type { CampaignPayload } from "@/src/types";
import { AmmStep } from "./dex-step";

import styles from "./styles.module.css";
import { StartDateStep } from "./start-date-step";
import { EndDateStep } from "./end-date-step";
import { PoolStep } from "./pool-step";

export interface CreateCampaignFormProps {
    payloadIndex: number;
    payload?: CampaignPayload;
    onPayloadChange: (payload: CampaignPayload, payloadIndex: number) => void;
}

export function CreateCampaignForm({
    payload,
    payloadIndex,
    onPayloadChange,
}: CreateCampaignFormProps) {
    return (
        <div className={styles.root}>
            <AmmStep
                payload={payload}
                payloadIndex={payloadIndex}
                onPayloadChange={onPayloadChange}
            />
            <PoolStep
                payload={payload}
                payloadIndex={payloadIndex}
                onPayloadChange={onPayloadChange}
            />
            <StartDateStep
                payload={payload}
                payloadIndex={payloadIndex}
                onPayloadChange={onPayloadChange}
            />
            <EndDateStep
                payload={payload}
                payloadIndex={payloadIndex}
                onPayloadChange={onPayloadChange}
            />
        </div>
    );
}
