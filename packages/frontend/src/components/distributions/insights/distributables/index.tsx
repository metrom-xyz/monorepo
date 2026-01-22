import { useRef, useState } from "react";
import type { TokenDistributables } from "@metrom-xyz/sdk";
import { Popover, Typography } from "@metrom-xyz/ui";
import { formatUsdAmount } from "@/src/utils/format";
import { useTranslations } from "next-intl";
import { CampaignTokensDistributablesList } from "@/src/components/campaign-tokens-distributables-list";

import styles from "./styles.module.css";

interface DistributablesProps {
    chain: number;
    distributables: TokenDistributables;
}

export function Distributables({ chain, distributables }: DistributablesProps) {
    const t = useTranslations("campaignDistributions.insights");

    const [popover, setPopover] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLDivElement | null>(
        null,
    );
    const popoverRef = useRef<HTMLDivElement>(null);

    function onPopoverOpen() {
        setPopover(true);
    }

    function onPopoverClose() {
        setPopover(false);
    }

    return (
        <>
            <Popover
                ref={popoverRef}
                anchor={popoverAnchor}
                open={popover}
                onOpenChange={setPopover}
            >
                <div className={styles.content}>
                    <Typography
                        size="sm"
                        weight="medium"
                        variant="tertiary"
                        uppercase
                        className={styles.header}
                    >
                        {t("incetivizedAssets")}
                    </Typography>
                    <CampaignTokensDistributablesList
                        chain={chain}
                        distributables={distributables.list}
                    />
                </div>
            </Popover>
            <Typography
                ref={setPopoverAnchor}
                weight="medium"
                onMouseEnter={onPopoverOpen}
                onMouseLeave={onPopoverClose}
                className={styles.mainText}
            >
                {formatUsdAmount({ amount: distributables.amountUsdValue })}
            </Typography>
        </>
    );
}
