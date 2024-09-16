import { useRef } from "react";
import { useAccount, useChainId } from "wagmi";
import { FixedSizeList } from "react-window";
import { useTranslations } from "next-intl";
import {
    type Token,
    type TokenAmount,
    type WhitelistedErc20Token,
} from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import { useWhitelistedRewardsTokens } from "@/src/hooks/useWhitelistedRewardsTokens";
import { useWatchBalances } from "@/src/hooks/useWatchBalances";
import { Row } from "./row";

import styles from "./styles.module.css";

const TOKENS_LIMIT = 6;

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
        <div className={styles.root}>
            <div className={styles.listHeader}>
                <Typography uppercase variant="xs" weight="medium" light>
                    {t("list.token")}
                </Typography>
                <Typography uppercase variant="xs" weight="medium" light>
                    {t("list.balance")}
                </Typography>
            </div>
            {loading || whitelistedTokensWithBalance.length > 0 ? (
                <FixedSizeList
                    ref={listRef}
                    height={
                        loading
                            ? TOKENS_LIMIT * 57
                            : whitelistedTokensWithBalance.length * 57
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
                                    whitelistedToken.address === value?.address
                                }
                                token={whitelistedToken}
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
