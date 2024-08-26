import { CircledXIcon } from "@/src/assets/circled-x-icon";
import type { CampaignPayload } from "@/src/types";
import { Button } from "@/src/ui/button";
import { PoolRemoteLogo } from "@/src/ui/pool-remote-logo";
import { TextField } from "@/src/ui/text-field";
import { Typography } from "@/src/ui/typography";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import numeral from "numeral";

import styles from "./styles.module.css";

interface HeaderProps {
    payload: CampaignPayload;
    backDisabled: boolean;
    onBack: () => void;
}

export function Header({ payload, backDisabled, onBack }: HeaderProps) {
    const t = useTranslations("campaignPreview.header");

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
                    chain={payload.pool?.chainId}
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
                    {numeral(payload.pool?.fee).format("0.0[0]")}%
                </Typography>
            </div>
            <div className={styles.durationContainer}>
                <TextField
                    label={t("startDate")}
                    value={dayjs(payload.startDate).format("DD/MMM/YY HH:mm")}
                />
                <TextField
                    alignment="center"
                    label={t("runTime")}
                    value={t("runTimeDays", {
                        count: payload.startDate?.diff(payload.endDate, "days"),
                    })}
                />
                <TextField
                    alignment="right"
                    label={t("endDate")}
                    value={dayjs(payload.endDate).format("DD/MMM/YY HH:mm")}
                />
            </div>
        </div>
    );
}
