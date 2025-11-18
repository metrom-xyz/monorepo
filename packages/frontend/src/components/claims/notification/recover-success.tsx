import { useTranslations } from "next-intl";
import { ToastNotification, Typography } from "@metrom-xyz/ui";
import { ClaimRewardIcon } from "@/src/assets/claim-reward-icon";
import { RemoteLogo } from "@/src/components/remote-logo";
import type { Erc20Token } from "@metrom-xyz/sdk";
import { formatAmount } from "@/src/utils/format";
import type { SupportedChain } from "@metrom-xyz/contracts";

import styles from "./styles.module.css";

interface RecoverSuccessProps {
    toastId: string | number;
    chain?: SupportedChain;
    token?: Erc20Token;
    amount?: number;
    safe?: boolean;
}

export function RecoverSuccess({
    toastId,
    chain,
    token,
    amount,
    safe,
}: RecoverSuccessProps) {
    const t = useTranslations("rewards.reimbursements.notification.success");

    return (
        <ToastNotification
            toastId={toastId}
            title={safe ? t("safe") : t("standard")}
            icon={ClaimRewardIcon}
        >
            {!!chain && !!token && !!amount && (
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
            )}
        </ToastNotification>
    );
}
