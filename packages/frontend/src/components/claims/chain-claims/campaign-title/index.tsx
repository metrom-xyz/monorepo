import { useCampaign } from "@/src/hooks/useCampaign";
import type { ChainType } from "@metrom-xyz/sdk";
import { Skeleton, Typography } from "@metrom-xyz/ui";
import type { Address } from "viem";
import { Status } from "@/src/components/campaign-details/status";

import styles from "./styles.module.css";

interface CampaignTitleProps {
    campaignId: Address;
    chainId: number;
    chainType: ChainType;
}

export function CampaignTitle({
    campaignId,
    chainId,
    chainType,
}: CampaignTitleProps) {
    const { campaign, loading } = useCampaign({
        id: campaignId,
        chainId,
        chainType,
    });

    if (!campaign || loading) {
        return <Skeleton />;
    }

    const { name, from, to, status } = campaign;

    return (
        <div className={styles.root}>
            <Typography weight="medium">{name}</Typography>
            <Status size="sm" from={from} to={to} status={status} />
        </div>
    );
}
