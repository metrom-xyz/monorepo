import { useEffect, useMemo, useRef } from "react";
import {
    useAccount,
    useBlockNumber,
    useChainId,
    useReadContracts,
} from "wagmi";
import { erc20Abi } from "viem";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { useTranslations } from "next-intl";
import {
    type Token,
    type TokenAmount,
    type WhitelistedErc20Token,
    type WhitelistedErc20TokenWithBalance,
} from "@metrom-xyz/sdk";
import { Typography } from "@/src/ui/typography";
import { useWhitelistedRewardsTokens } from "@/src/hooks/useWhitelistedRewardsTokens";
import { Row } from "./row";

import styles from "./styles.module.css";

interface RewardTokensListProps {
    value?: Token;
    unavailable?: TokenAmount[];
    onRewardTokenClick: (token: WhitelistedErc20Token) => void;
}

export function RewardTokensList({
    value,
    unavailable,
    onRewardTokenClick,
}: RewardTokensListProps) {
    const t = useTranslations("newCampaign.form.rewards");
    const listRef = useRef(null);

    const { address } = useAccount();
    const chainId = useChainId();
    const { whitelistedTokens, loading } = useWhitelistedRewardsTokens();

    const { data: blockNumber } = useBlockNumber({ watch: true });
    // TODO: check if this works well with a lot of whitelisted tokens
    const {
        data: rewardTokenRawBalances,
        isLoading: loadingBalances,
        refetch,
    } = useReadContracts({
        contracts: whitelistedTokens.map((whitelistedToken) => {
            return {
                address: whitelistedToken?.address,
                abi: erc20Abi,
                functionName: "balanceOf",
                args: [address],
            };
        }),
        allowFailure: true,
        query: { enabled: !!address },
    });

    const whitelistedTokensWithBalance = useMemo(() => {
        if (
            !rewardTokenRawBalances ||
            rewardTokenRawBalances.length !== whitelistedTokens.length
        )
            return whitelistedTokens;

        const tokensInChainWithBalance = whitelistedTokens.reduce(
            (
                accumulator: Record<string, WhitelistedErc20TokenWithBalance>,
                token,
                i,
            ) => {
                const rawBalance = rewardTokenRawBalances[i];
                accumulator[`${token.address.toLowerCase()}`] =
                    rawBalance.status !== "failure"
                        ? {
                              ...token,
                              balance: rawBalance.result as bigint,
                          }
                        : { ...token, balance: undefined };
                return accumulator;
            },
            {},
        );

        return Object.values(tokensInChainWithBalance);
    }, [rewardTokenRawBalances, whitelistedTokens]);

    useEffect(() => {
        refetch();
    }, [blockNumber, refetch]);

    return (
        <div className={styles.root}>
            <div className={styles.listHeader}>
                <Typography uppercase variant="sm" weight="medium" light>
                    {t("list.token")}
                </Typography>
                <Typography uppercase variant="sm" weight="medium" light>
                    {t("list.balance")}
                </Typography>
            </div>
            {loading || whitelistedTokensWithBalance.length > 0 ? (
                <AutoSizer>
                    {({ height, width }) => {
                        return (
                            <FixedSizeList
                                ref={listRef}
                                height={height}
                                width={width}
                                itemCount={
                                    loading
                                        ? 6
                                        : whitelistedTokensWithBalance.length
                                }
                                itemData={
                                    loading
                                        ? new Array(6).fill(null)
                                        : whitelistedTokensWithBalance
                                }
                                itemSize={57}
                                className={styles.list}
                            >
                                {({ index, style, data }) => {
                                    const token: WhitelistedErc20TokenWithBalance | null =
                                        data[index];
                                    return (
                                        <Row
                                            style={style}
                                            chain={chainId}
                                            loading={loading || loadingBalances}
                                            disabled={
                                                !!unavailable?.find(
                                                    ({ token: { address } }) =>
                                                        address ===
                                                        token?.address,
                                                )
                                            }
                                            active={
                                                !!token &&
                                                token.address === value?.address
                                            }
                                            token={token}
                                            onClick={onRewardTokenClick}
                                        />
                                    );
                                }}
                            </FixedSizeList>
                        );
                    }}
                </AutoSizer>
            ) : (
                <div className={styles.emptyList}>
                    {/* TODO: add illustration */}
                    <Typography>{t("list.empty")}</Typography>
                </div>
            )}
        </div>
    );
}
