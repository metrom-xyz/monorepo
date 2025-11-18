import { useTranslations } from "next-intl";
import { ToastNotification, Typography } from "@metrom-xyz/ui";
import { ClaimRewardIcon } from "@/src/assets/claim-reward-icon";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { Erc20Token } from "@metrom-xyz/sdk";
import { formatAmount } from "@/src/utils/format";
import type { SupportedChain } from "@metrom-xyz/contracts";

import styles from "./styles.module.css";

interface ClaimSuccessProps {
    toastId: string | number;
    chain?: SupportedChain;
    token?: Erc20Token;
    amount?: number;
    safe?: boolean;
}

export function ClaimSuccess({
    toastId,
    chain,
    token,
    amount,
    safe,
}: ClaimSuccessProps) {
    const t = useTranslations("rewards.claims.notification.success");

    return (
        <ToastNotification
            toastId={toastId}
            title={safe ? t("safe.title") : t("standard.title")}
            icon={ClaimRewardIcon}
        >
            {!!chain && !!token && !!amount ? (
                <div className={styles.contentWrapper}>
                    <RemoteLogo
                        size="sm"
                        chain={chain}
                        address={token.address}
                        defaultText={token.symbol}
                    />
                    <Typography weight="medium">{token.symbol}</Typography>
                    <Typography weight="medium">
                        {formatAmount({ amount })}
                    </Typography>
                </div>
            ) : (
                <Typography weight="medium">
                    {safe ? t("safe.message") : t("standard.message")}
                </Typography>
            )}
        </ToastNotification>
    );
}
