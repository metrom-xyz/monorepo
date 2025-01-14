import { CircledXIcon } from "@/src/assets/circled-x-icon";
import type { CampaignPayload } from "@/src/types";
import { Button, TextField, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useChainId } from "wagmi";
import { formatDateTime, formatPercentage } from "@/src/utils/format";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";

import styles from "./styles.module.css";

interface HeaderProps {
    payload: CampaignPayload;
    backDisabled: boolean;
    onBack: () => void;
}

export function Header({ payload, backDisabled, onBack }: HeaderProps) {
    const t = useTranslations("campaignPreview.header");
    const chainId = useChainId();

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
                <PoolRemoteLogo
                    chain={chainId}
                    size="xl"
                    tokens={
                        payload.pool?.tokens.map((token) => ({
                            address: token.address,
                            defaultText: token.symbol,
                        })) || []
                    }
                />
                <Typography size="xl4" weight="medium" noWrap truncate>
                    {payload.dex?.name}{" "}
                    {payload.pool?.tokens
                        .map((token) => token.symbol)
                        .join(" / ")}
                </Typography>
                {payload.pool?.fee && (
                    <Typography size="lg" weight="medium" light>
                        {formatPercentage(payload.pool.fee)}
                    </Typography>
                )}
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
