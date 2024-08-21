import { useTranslations } from "next-intl";
import type {
    CampaignPayload,
    CampaignPayloadPart,
    CampaignPayloadErrors,
} from "@/src/types";
import { AmmStep } from "./amm-step";
import { PoolStep } from "./pool-step";
import { StartDateStep } from "./start-date-step";
import { EndDateStep } from "./end-date-step";
import { RewardsStep } from "./rewards-step";

import styles from "./styles.module.css";

export interface CreateCampaignFormProps {
    payload?: CampaignPayload;
    onPayloadChange: (part: CampaignPayloadPart) => void;
    onPayloadError: (errors: CampaignPayloadErrors) => void;
}

export function CreateCampaignForm({
    payload,
    onPayloadChange,
    onPayloadError,
}: CreateCampaignFormProps) {
    const t = useTranslations("newCampaign.form");

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
                endDate={payload?.endDate}
                onStartDateChange={onPayloadChange}
                onError={onPayloadError}
            />
            <EndDateStep
                disabled={!payload?.startDate}
                startDate={payload?.startDate}
                endDate={payload?.endDate}
                onEndDateChange={onPayloadChange}
                onError={onPayloadError}
            />
            <RewardsStep
                disabled={!payload?.endDate}
                rewards={payload?.rewards}
                startDate={payload?.startDate}
                endDate={payload?.endDate}
                onRewardsChange={onPayloadChange}
                onError={onPayloadError}
            />
        </div>
    );
}
