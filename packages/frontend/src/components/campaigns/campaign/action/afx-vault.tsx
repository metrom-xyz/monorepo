import { Typography } from "@metrom-xyz/ui";
import { TargetType } from "@metrom-xyz/sdk";
import type {
    Campaign,
    TargetedNamedCampaign,
} from "@/src/types/campaign/common";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { ActionSizes } from ".";
import { ArrowRightIcon } from "@/src/assets/arrow-right-icon";
import { arbitrum } from "viem/chains";
import { ARBITRUM_USDC } from "@/src/commons";

import styles from "./styles.module.css";

interface AfxVaultProps<T extends TargetType.Afx> extends ActionSizes {
    campaign: TargetedNamedCampaign<T, Campaign>;
}

export function AfxVault<T extends TargetType.Afx>({
    nameSize,
    logoSize,
    campaign,
}: AfxVaultProps<T>) {
    return (
        <>
            {/* Hardcode chain because deposits on AFX vaults are done on Arbitrum */}
            <RemoteLogo
                size={logoSize}
                chain={arbitrum.id}
                address={ARBITRUM_USDC}
            />
            <Typography size={nameSize} weight="medium" truncate>
                {campaign.name}
            </Typography>
            <ArrowRightIcon className={styles.externalLinkIcon} />
        </>
    );
}
