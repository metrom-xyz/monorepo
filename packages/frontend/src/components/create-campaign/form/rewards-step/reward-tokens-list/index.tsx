import { useRef } from "react";
import { useAccount, useChainId } from "wagmi";
import { FixedSizeList } from "react-window";
import { useTranslations } from "next-intl";
import {
    type Erc20Token,
    type Erc20TokenAmount,
    type WhitelistedErc20Token,
} from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { useWhitelistedRewardsTokens } from "@/src/hooks/useWhitelistedRewardsTokens";
import {
    useWatchBalances,
    type Erc20TokenWithBalance,
} from "@/src/hooks/useWatchBalances";
import { Row } from "./row";

import styles from "./styles.module.css";

const TOKENS_LIMIT = 6;

interface RewardTokensListProps {
    value?: Erc20Token;
    unavailable?: Erc20TokenAmount[];
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
        <div className={styles.root}>
            <div className={styles.listHeader}>
                <Typography uppercase size="xs" weight="medium" light>
                    {t("list.token")}
                </Typography>
                <Typography uppercase size="xs" weight="medium" light>
                    {t("list.balance")}
                </Typography>
            </div>
            {loading || whitelistedTokensWithBalance.length > 0 ? (
                <FixedSizeList
                    ref={listRef}
                    height={
                        loading
                            ? TOKENS_LIMIT * 57
                            : Math.min(
                                  whitelistedTokensWithBalance.length,
                                  TOKENS_LIMIT,
                              ) * 57
                    }
                    width={"100%"}
                    itemCount={
                        loading
                            ? TOKENS_LIMIT
                            : whitelistedTokensWithBalance.length
                    }
                    itemData={
                        loading
                            ? new Array(TOKENS_LIMIT).fill(null)
                            : whitelistedTokensWithBalance
                    }
                    itemSize={57}
                    className={styles.list}
                >
                    {({ index, style, data }) => {
                        const whitelistedToken: Erc20TokenWithBalance<WhitelistedErc20Token> | null =
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
                                            whitelistedToken?.token.address,
                                    )
                                }
                                active={
                                    !!whitelistedToken &&
                                    whitelistedToken.token.address ===
                                        value?.address
                                }
                                tokenWithBalance={whitelistedToken}
                                onClick={onRewardTokenClick}
                            />
                        );
                    }}
                </FixedSizeList>
            ) : (
                <div className={styles.emptyList}>
                    {/* TODO: add illustration */}
                    <Typography>{t("list.empty")}</Typography>
                </div>
            )}
        </div>
    );
}
