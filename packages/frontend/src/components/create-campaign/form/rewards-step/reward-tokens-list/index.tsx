import { useRef } from "react";
import { useAccount, useChainId } from "wagmi";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { useTranslations } from "next-intl";
import {
    type Token,
    type TokenAmount,
    type WhitelistedErc20Token,
} from "@metrom-xyz/sdk";
import { Typography } from "@/src/ui/typography";
import { useWhitelistedRewardsTokens } from "@/src/hooks/useWhitelistedRewardsTokens";
import { useWatchBalances } from "@/src/hooks/useWatchBalances";
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

    const {
        tokensWithBalance: whitelistedTokensWithBalance,
        loading: loadingBalances,
    } = useWatchBalances(address, whitelistedTokens);
    return (
        <div
            className={styles.root}
            style={{
                height: loading
                    ? "22.5rem"
                    : `${Math.min(whitelistedTokensWithBalance.length - 1, 5) * 3.3 + 6}rem`,
            }}
        >
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
                                    const whitelistedToken: WhitelistedErc20Token | null =
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
                                                        whitelistedToken?.address,
                                                )
                                            }
                                            active={
                                                !!whitelistedToken &&
                                                whitelistedToken.address ===
                                                    value?.address
                                            }
                                            token={whitelistedToken}
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
