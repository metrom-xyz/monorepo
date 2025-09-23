import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import {
    CampaignKind,
    type AaveV3CampaignPreviewPayload,
} from "@/src/types/campaign";
import { useMemo } from "react";
import { RemoteLogo } from "@/src/components/remote-logo";
import { useChainWithType } from "@/src/hooks/useChainWithType";

import styles from "./styles.module.css";

// TODO: maybe have this in the commons, and add all campaign kinds so it's not scoped for each campaign type
export const CAMPAIGN_KIND_TITLES = [
    {
        title: "list.borrow",
        logo: null,
        value: CampaignKind.AaveV3Borrow,
    },
    {
        title: "list.supply",
        logo: null,
        value: CampaignKind.AaveV3Supply,
    },
    {
        title: "list.netSupply",
        logo: null,
        value: CampaignKind.AaveV3NetSupply,
    },
    {
        title: "list.bridgeAndSupply",
        logo: null,
        value: CampaignKind.AaveV3BridgeAndSupply,
    },
] as const;

interface AaveV3Props {
    payload: AaveV3CampaignPreviewPayload;
}

export function AaveV3({ payload }: AaveV3Props) {
    const t = useTranslations("campaignPreview.header");
    const { id: chainId } = useChainWithType();

    const action = useMemo(() => {
        return CAMPAIGN_KIND_TITLES.find(
            ({ value }) => value === payload.action,
        );
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
