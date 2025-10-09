import {
    AmmPoolLiquidityCampaignPreviewPayload,
    AaveV3CampaignPreviewPayload,
    LiquityV2CampaignPreviewPayload,
    type BaseCampaignPreviewPayload,
    EmptyTargetCampaignPreviewPayload,
    HoldFungibleAssetCampaignPreviewPayload,
} from "@/src/types/campaign";
import { Button, TextField } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { formatDateTime } from "@/src/utils/format";
import { LiquityV2 } from "./liquity-v2";
import { AmmPoolLiquidity } from "./amm-pool-liquidity";
import { AaveV3 } from "./aave-v3";
import { useChainData } from "@/src/hooks/useChainData";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { Empty } from "./empty";
import { HoldFungibleAsset } from "./hold-fungible-asset";

import styles from "./styles.module.css";

interface HeaderProps {
    payload: BaseCampaignPreviewPayload;
    backDisabled: boolean;
    onBack: () => void;
}

export function Header({ payload, backDisabled, onBack }: HeaderProps) {
    const t = useTranslations("campaignPreview.header");
    const { id: chainId, type: chainType } = useChainWithType();
    const chainData = useChainData({ chainId, chainType });

    const ammPoolLiquidity =
        payload instanceof AmmPoolLiquidityCampaignPreviewPayload;
    const liquityV2 = payload instanceof LiquityV2CampaignPreviewPayload;
    const aaveV3 = payload instanceof AaveV3CampaignPreviewPayload;
    const holdFungibleAsset = payload instanceof HoldFungibleAssetCampaignPreviewPayload;
    const empty = payload instanceof EmptyTargetCampaignPreviewPayload;

    const ChainLogo = chainData?.icon;

    return (
        <div className={styles.root}>
            <Button
                variant="secondary"
                size="xs"
                onClick={onBack}
                disabled={backDisabled}
                className={{
                    root: styles.backButton,
                }}
            >
                {t("back")}
            </Button>
            <TextField
                label={t("action")}
                value={
                    <div className={styles.titleContainer}>
                        {ChainLogo && (
                            <ChainLogo className={styles.chainIcon} />
                        )}
                        {ammPoolLiquidity && (
                            <AmmPoolLiquidity payload={payload} />
                        )}
                        {liquityV2 && <LiquityV2 payload={payload} />}
                        {aaveV3 && <AaveV3 payload={payload} />}
                        {holdFungibleAsset && <HoldFungibleAsset payload={payload} />}
                        {empty && <Empty payload={payload} />}
                    </div>
                }
            />
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
