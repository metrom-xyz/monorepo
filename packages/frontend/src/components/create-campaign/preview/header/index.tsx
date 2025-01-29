import { CircledXIcon } from "@/src/assets/circled-x-icon";
import {
    AmmPoolLiquidityCampaignPreviewPayload,
    LiquityV2CampaignPreviewPayload,
    ProtocolType,
    type BaseCampaignPreviewPayload,
} from "@/src/types";
import { Button, TextField, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { useChainId } from "wagmi";
import { formatDateTime, formatPercentage } from "@/src/utils/format";
import { PoolRemoteLogo } from "@/src/components/pool-remote-logo";
import { useProtocolsInChain } from "@/src/hooks/useProtocolsInChain";
import { useMemo } from "react";
import { LIQUITY_V2_SUPPORTED_ACTIONS } from "../../steps/liquity-v2-action-step";

import styles from "./styles.module.css";

interface HeaderProps {
    payload: BaseCampaignPreviewPayload;
    backDisabled: boolean;
    onBack: () => void;
}

export function Header({ payload, backDisabled, onBack }: HeaderProps) {
    const t = useTranslations("campaignPreview.header");
    const chainId = useChainId();

    const availableDexes = useProtocolsInChain(chainId, ProtocolType.Dex);

    const ammPoolLiquidityCampaign =
        payload instanceof AmmPoolLiquidityCampaignPreviewPayload;
    const liquityV2Campaign =
        payload instanceof LiquityV2CampaignPreviewPayload;

    const selectedDex = useMemo(() => {
        if (!ammPoolLiquidityCampaign) return undefined;
        return availableDexes.find(
            ({ slug }) => slug === payload.pool.dex.slug,
        );
    }, [ammPoolLiquidityCampaign, availableDexes, payload]);

    const liquityV2Action = useMemo(() => {
        if (!liquityV2Campaign) return undefined;
        return LIQUITY_V2_SUPPORTED_ACTIONS.find(
            (action) => action.value === payload.action,
        );
    }, [liquityV2Campaign, payload]);

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
                    <>
                        <PoolRemoteLogo
                            chain={chainId}
                            size="xl"
                            tokens={payload.pool.tokens.map((token) => ({
                                address: token.address,
                                defaultText: token.symbol,
                            }))}
                        />
                        <Typography size="xl4" weight="medium" noWrap truncate>
                            {selectedDex?.name}{" "}
                            {payload.pool.tokens
                                .map((token) => token.symbol)
                                .join(" / ")}
                        </Typography>
                        {payload.pool.fee && (
                            <Typography size="lg" weight="medium" light>
                                {formatPercentage({
                                    percentage: payload.pool.fee,
                                    keepDust: true,
                                })}
                            </Typography>
                        )}
                    </>
                )}
                {liquityV2Campaign && (
                    <div className={styles.liquityV2Action}>
                        {liquityV2Action?.logo}
                        <Typography weight="medium" size="xl">
                            {t(`liquityV2Actions.${liquityV2Action?.title}`)}
                        </Typography>
                    </div>
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
