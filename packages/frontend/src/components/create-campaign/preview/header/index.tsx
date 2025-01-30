import { CircledXIcon } from "@/src/assets/circled-x-icon";
import {
    AmmPoolLiquidityCampaignPreviewPayload,
    LiquityV2CampaignPreviewPayload,
    type BaseCampaignPreviewPayload,
} from "@/src/types";
import { Button, TextField } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatDateTime } from "@/src/utils/format";
import { LiquityV2 } from "./liquity-v2";
import { AmmPoolLiquidity } from "./amm-pool-liquidity";

import styles from "./styles.module.css";

interface HeaderProps {
    payload: BaseCampaignPreviewPayload;
    backDisabled: boolean;
    onBack: () => void;
}

export function Header({ payload, backDisabled, onBack }: HeaderProps) {
    const t = useTranslations("campaignPreview.header");

    const ammPoolLiquidityCampaign =
        payload instanceof AmmPoolLiquidityCampaignPreviewPayload;
    const liquityV2Campaign =
        payload instanceof LiquityV2CampaignPreviewPayload;

    return (
        <div className={styles.root}>
            <Button
                icon={CircledXIcon}
                iconPlacement="right"
                variant="secondary"
                size="xs"
                onClick={onBack}
                disabled={backDisabled}
                className={{
                    root: styles.backButton,
                    contentWrapper: styles.backButtonContent,
                }}
            >
                {t("back")}
            </Button>
            <div className={styles.titleContainer}>
                {ammPoolLiquidityCampaign && (
                    <AmmPoolLiquidity payload={payload} />
                )}
                {liquityV2Campaign && <LiquityV2 payload={payload} />}
            </div>
            <div className={styles.durationContainer}>
                <TextField
                    uppercase
                    size="xl"
                    label={t("startDate")}
                    value={formatDateTime(payload.startDate)}
                    className={styles.textField}
                />
                <TextField
                    size="xl"
                    label={t("runTimeLabel")}
                    value={
                        payload.startDate && payload.endDate
                            ? payload.startDate.to(payload.endDate, true)
                            : "-"
                    }
                    className={styles.textField}
                />
                <TextField
                    uppercase
                    size="xl"
                    label={t("endDate")}
                    value={formatDateTime(payload.endDate)}
                    className={styles.textField}
                />
            </div>
        </div>
    );
}
