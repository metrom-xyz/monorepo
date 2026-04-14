import { useChainId } from "wagmi";
import { RemoteLogo } from "@/src/components/remote-logo";
import { Typography } from "@metrom-xyz/ui";
import { formatAmount } from "@/src/utils/format";
import { useTranslations } from "next-intl";
import type { UsdPricedErc20TokenAmount } from "@metrom-xyz/sdk";
import { CheckIcon } from "@/src/assets/check-icon";
import { AnimatePresence, motion } from "motion/react";

import styles from "./styles.module.css";

interface TokenToApproveProps extends UsdPricedErc20TokenAmount {
    index: number;
    totalTokens: number;
    approving: boolean;
    approved: boolean;
    loading: boolean;
}

export function TokenToApproveEvm({
    token,
    amount,
    index,
    totalTokens,
    approving,
    approved,
    loading,
}: TokenToApproveProps) {
    const t = useTranslations("newCampaign.form.approveLaunch");
    const chainId = useChainId();

    return (
        <div className={styles.reward}>
            <div className={styles.rewardLogoWrapper}>
                <AnimatePresence>
                    {(approving || loading) && !approved && (
                        <motion.div
                            key="spinner"
                            className={styles.spinner}
                            animate={{ rotate: 360 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                rotate: {
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                },
                                opacity: { duration: 0.2 },
                            }}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                    {approved ? (
                        <motion.div
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 700,
                                damping: 60,
                            }}
                        >
                            <CheckIcon className={styles.checkIcon} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="logo"
                            initial={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 700,
                                damping: 60,
                            }}
                        >
                            <RemoteLogo
                                size="sm"
                                chain={chainId}
                                address={token.address}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className={styles.rewardText}>
                <Typography
                    size="xs"
                    weight="medium"
                    variant="tertiary"
                    uppercase
                >
                    {t("xOfY", {
                        current: index + 1,
                        total: totalTokens,
                    })}
                </Typography>
                <Typography size="sm" weight="medium">
                    {approved
                        ? t("approvedReward", {
                              amount: formatAmount({
                                  amount: amount.formatted,
                              }),
                              symbol: token.symbol,
                          })
                        : t("approveReward", {
                              amount: formatAmount({
                                  amount: amount.formatted,
                              }),
                              symbol: token.symbol,
                          })}
                </Typography>
            </div>
        </div>
    );
}
