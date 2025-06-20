import { Card, TextField, Typography } from "@metrom-xyz/ui";
import { useTranslations } from "next-intl";
import { ClaimableFees } from "@/hooks/useClaimableFees";
import { formatUsdAmount } from "@/utils/format";
import { useCallback, useMemo } from "react";
import { useChainId, useSwitchChain } from "wagmi";
import classNames from "classnames";

import styles from "./styles.module.css";

interface ChainsListProps {
    loading: boolean;
    totalUsd: number;
    claimableFees?: ClaimableFees;
}

export function ChainsList({
    loading,
    totalUsd,
    claimableFees,
}: ChainsListProps) {
    const t = useTranslations("chainsList");
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();

    const chains = useMemo(() => {
        if (!claimableFees) return [];

        return Object.entries(claimableFees)
            .map(([, claimableFee]) => ({
                chain: claimableFee.chain,
                totalUsd: claimableFee.totalUsd,
            }))
            .filter(({ totalUsd }) => totalUsd > 0)
            .sort((a, b) => b.totalUsd - a.totalUsd);
    }, [claimableFees]);

    const getOnChainClickHandler = useCallback(
        (chainId: number) => {
            return () => {
                switchChain({ chainId });
            };
        },
        [switchChain],
    );

    return (
        <Card className={styles.root}>
            <TextField
                label={t("title")}
                loading={loading}
                value={formatUsdAmount({ amount: totalUsd })}
            />
            <Typography uppercase light weight="medium" size="sm">
                {t("chains")}
            </Typography>
            <div className={styles.list}>
                {loading
                    ? Array.from({ length: 5 }).map((_, index) => (
                          <div
                              key={index}
                              className={classNames(
                                  styles.chain,
                                  styles.skeleton,
                              )}
                          />
                      ))
                    : chains.map(({ chain, totalUsd }) => (
                          <div
                              key={chain.id}
                              onClick={getOnChainClickHandler(chain.id)}
                              className={classNames(styles.chain, {
                                  [styles.selected]: chainId === chain.id,
                              })}
                          >
                              <chain.icon className={styles.icon} />
                              <Typography>{chain.name}</Typography>
                              <Typography>
                                  {formatUsdAmount({ amount: totalUsd })}
                              </Typography>
                          </div>
                      ))}
            </div>
        </Card>
    );
}
