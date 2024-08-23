import type { CampaignPayload } from "@/src/types";
import { RemoteLogo } from "@/src/ui/remote-logo";
import { TextField } from "@/src/ui/text-field";
import { Typography } from "@/src/ui/typography";
import type { SupportedChain } from "@metrom-xyz/contracts";
import { useTranslations } from "next-intl";
import numeral from "numeral";
import { useChainId } from "wagmi";

import styles from "./styles.module.css";

interface RewardsProps {
    rewards: CampaignPayload["rewards"];
}

export function Rewards({ rewards }: RewardsProps) {
    const t = useTranslations("campaignPreview.rewards");
    const chain: SupportedChain = useChainId();

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Typography uppercase weight="medium" light variant="sm">
                    {t("token")}
                </Typography>
                <Typography uppercase weight="medium" light variant="sm">
                    {t("amount")}
                </Typography>
            </div>
            {rewards?.map((reward) => (
                <div key={reward.token.address} className={styles.row}>
                    <div className={styles.nameContainer}>
                        <RemoteLogo
                            chain={chain}
                            address={reward.token.address}
                        />
                        <Typography uppercase weight="medium" variant="lg">
                            {reward.token.symbol}
                        </Typography>
                    </div>
                    {/* TODO: add rewards usd */}
                    <Typography uppercase weight="medium" light>
                        $ 0
                    </Typography>
                    <Typography uppercase weight="medium" variant="lg">
                        {numeral(reward.amount).format("(0.00[00] a)")}
                    </Typography>
                </div>
            ))}
            <div className={styles.summary}>
                {/* TODO: add rewards usd */}
                <TextField
                    boxed
                    label={t("daily")}
                    value={"$ 0"}
                    className={styles.summaryBox}
                />
                <TextField
                    boxed
                    label={t("total")}
                    value={"$ 0"}
                    className={styles.summaryBox}
                />
            </div>
        </div>
    );
}
