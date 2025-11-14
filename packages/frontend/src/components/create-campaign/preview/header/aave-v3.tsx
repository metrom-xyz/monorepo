import { Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { type AaveV3CampaignPreviewPayload } from "@/src/types/campaign";
import { RemoteLogo } from "@/src/components/remote-logo";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { getCampaignPreviewName } from "@/src/utils/campaign";

import styles from "./styles.module.css";

interface AaveV3Props {
    payload: AaveV3CampaignPreviewPayload;
}

export function AaveV3({ payload }: AaveV3Props) {
    const t = useTranslations();
    const { id: chainId } = useChainWithType();

    return (
        <>
            <RemoteLogo
                size="lg"
                chain={chainId}
                address={payload.collateral.address}
            />
            <Typography weight="medium" size="xl">
                {getCampaignPreviewName(t, payload)}
            </Typography>
            {payload.blacklistedCollaterals &&
                payload.blacklistedCollaterals.length > 0 && (
                    <Typography weight="medium" light>
                        {t.rich(
                            "campaignActions.aaveV3NetSupplyBlocksBorrowing",
                            {
                                symbols: payload.blacklistedCollaterals
                                    ?.map(({ symbol }) => symbol)
                                    .join(", "),
                                bold: (chunks) => (
                                    <span className={styles.boldText}>
                                        {chunks}
                                    </span>
                                ),
                            },
                        )}
                    </Typography>
                )}
        </>
    );
}
