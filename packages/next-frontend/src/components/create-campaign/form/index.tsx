import { useTranslations } from "next-intl";
import type { CampaignPayload, CampaignPayloadPart } from "@/src/types";
import { Button } from "@/src/ui/button";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { AmmStep } from "./amm-step";
import { StartDateStep } from "./start-date-step";
import { EndDateStep } from "./end-date-step";
import { PoolStep } from "./pool-step";

import styles from "./styles.module.css";

export interface CreateCampaignFormProps {
    payload?: CampaignPayload;
    onPayloadChange: (part: CampaignPayloadPart) => void;
}

export function CreateCampaignForm({
    payload,
    onPayloadChange,
}: CreateCampaignFormProps) {
    const t = useTranslations("new_campaign.form");

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
            />
            <EndDateStep
                disabled={!payload?.startDate}
                startDate={payload?.startDate}
                endDate={payload?.endDate}
                onEndDateChange={onPayloadChange}
            />
            <Button
                icon={ArrowRightIcon}
                iconPlacement="right"
                className={{ root: styles.submitButton }}
            >
                {t("submit.preview")}
            </Button>
        </div>
    );
}
