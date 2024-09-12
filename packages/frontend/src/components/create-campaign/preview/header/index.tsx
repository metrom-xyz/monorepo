import { CircledXIcon } from "@/src/assets/circled-x-icon";
import type { CampaignPayload } from "@/src/types";
import { Button, TextField, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useChainId } from "wagmi";
import { formatDateTime, formatPercentage } from "@/src/utils/format";

import styles from "./styles.module.css";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";

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
                size="xsmall"
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
                    token0={{
                        address: payload.pool?.token0.address,
                        defaultText: payload.pool?.token0.symbol,
                    }}
                    token1={{
                        address: payload.pool?.token1.address,
                        defaultText: payload.pool?.token1.symbol,
                    }}
                />
                <Typography variant="xl4" weight="medium" noWrap>
                    {payload.amm?.name} {payload.pool?.token0.symbol} /{" "}
                    {payload.pool?.token1.symbol}
                </Typography>
                <Typography variant="lg" weight="medium" light>
                    {formatPercentage(payload.pool?.fee)}
                </Typography>
            </div>
            <div className={styles.durationContainer}>
                <TextField
                    uppercase
                    label={t("startDate")}
                    value={formatDateTime(payload.startDate)}
                />
                <TextField
                    alignment="center"
                    label={t("runTimeLabel")}
                    value={
                        payload.startDate && payload.endDate
                            ? payload.startDate.to(payload.endDate, true)
                            : "-"
                    }
                />
                <TextField
                    uppercase
                    alignment="right"
                    label={t("endDate")}
                    value={formatDateTime(payload.endDate)}
                />
            </div>
        </div>
    );
}
