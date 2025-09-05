import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { AaveV3CampaignPreviewPayload } from "@/src/types/campaign";
import { useMemo } from "react";
import { AAVE_V3_ACTIONS } from "../../steps/aave-v3-action-step";
import { RemoteLogo } from "@/src/components/remote-logo";
import { useChainWithType } from "@/src/hooks/useChainWithType";

import styles from "./styles.module.css";

interface AaveV3Props {
    payload: AaveV3CampaignPreviewPayload;
}

export function AaveV3({ payload }: AaveV3Props) {
    const t = useTranslations("campaignPreview.header");
    const { id: chainId } = useChainWithType();

    const action = useMemo(() => {
        return AAVE_V3_ACTIONS.find(({ value }) => value === payload.action);
    }, [payload]);

    return (
        <div className={styles.titleContainer}>
            {action && (
                <div className={styles.liquityV2Action}>
                    <Typography weight="medium" size="xl">
                        {t(`aaveV3Actions.${action.title}`, {
                            collateral: payload.collateral.token.symbol,
                        })}
                    </Typography>
                </div>
            )}
            <div className={styles.collateralsWrapper}>
                {payload.collateral && (
                    <RemoteLogo
                        key={payload.collateral.token.address}
                        size="xl"
                        chain={chainId}
                        address={payload.collateral.token.address}
                        className={styles.collateralLogo}
                    />
                )}
            </div>
        </div>
    );
}
