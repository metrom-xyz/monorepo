import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import type { LiquityV2CampaignPreviewPayload } from "@/src/types";
import { useMemo } from "react";
import { LIQUITY_V2_SUPPORTED_ACTIONS } from "../../steps/liquity-v2-action-step";
import { RemoteLogo } from "@/src/components/remote-logo";
import { useChainId } from "wagmi";

import styles from "./styles.module.css";

interface LiquityV2Props {
    payload: LiquityV2CampaignPreviewPayload;
}

export function LiquityV2({ payload }: LiquityV2Props) {
    const t = useTranslations("campaignPreview.header");
    const chainId = useChainId();

    const action = useMemo(() => {
        return LIQUITY_V2_SUPPORTED_ACTIONS.find(
            (action) => action.value === payload.action,
        );
    }, [payload]);

    return (
        <div className={styles.titleContainer}>
            <div className={styles.liquityV2Action}>
                {action?.logo}
                <Typography weight="medium" size="xl">
                    {t(`liquityV2Actions.${action?.title}`)}
                </Typography>
            </div>
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
