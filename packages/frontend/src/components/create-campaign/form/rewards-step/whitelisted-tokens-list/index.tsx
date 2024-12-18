import { useEffect, useRef } from "react";
import { useAccount, useChainId } from "wagmi";
import { FixedSizeList } from "react-window";
import { useTranslations } from "next-intl";
import {
    type Erc20Token,
    type Erc20TokenAmount,
    type WhitelistedErc20Token,
} from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import {
    useWhitelistedTokens,
    WhitelistedTokenType,
} from "@/src/hooks/useWhitelistedTokens";
import {
    useWatchBalances,
    type Erc20TokenWithBalance,
} from "@/src/hooks/useWatchBalances";
import { Row } from "./row";
import { easings, useSpring, animated, useTransition } from "@react-spring/web";
import classNames from "classnames";

import styles from "./styles.module.css";

const TOKENS_LIMIT = 6;

interface WhitelistedTokensListProps {
    type: WhitelistedTokenType;
    open?: boolean;
    value?: Erc20Token;
    unavailable?: Erc20TokenAmount[];
    onRewardTokenClick: (token: WhitelistedErc20Token) => void;
}

export function WhitelistedTokensList({
    type,
    open = false,
    value,
    unavailable,
    onRewardTokenClick,
}: WhitelistedTokensListProps) {
    const t = useTranslations("newCampaign.form.rewards");
    const rootRef = useRef<HTMLDivElement>(null);
    const listRef = useRef(null);

    const { address } = useAccount();
    const chainId = useChainId();
    const { whitelistedTokens, loading } = useWhitelistedTokens(type);

    const {
        tokensWithBalance: whitelistedTokensWithBalance,
        loading: loadingBalances,
    } = useWatchBalances(address, whitelistedTokens);

    const [springStyles, springApi] = useSpring(
        () => ({
            height: "0px",
        }),
        [],
    );
    const transition = useTransition(open, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 200, easing: easings.easeInOutCubic },
    });

    useEffect(() => {
        springApi.start({
            height: open ? `${rootRef?.current?.offsetHeight}px` : "0px",
            config: { duration: 200, easing: easings.easeInOutCubic },
        });
    }, [springApi, open]);

    return transition(
        (style, open) =>
            open && (
                <animated.div style={style}>
                    <animated.div
                        style={springStyles}
                        className={classNames(styles.root)}
                    >
                        <div ref={rootRef}>
                            <div className={styles.listHeader}>
                                <Typography
                                    uppercase
                                    size="xs"
                                    weight="medium"
                                    light
                                >
                                    {t("list.token")}
                                </Typography>
                                <Typography
                                    uppercase
                                    size="xs"
                                    weight="medium"
                                    light
                                >
                                    {t("list.balance")}
                                </Typography>
                            </div>
                            {loading ||
                            whitelistedTokensWithBalance.length > 0 ? (
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
                                                loading={
                                                    loading || loadingBalances
                                                }
                                                disabled={
                                                    !!unavailable?.find(
                                                        ({
                                                            token: { address },
                                                        }) =>
                                                            address ===
                                                            whitelistedToken
                                                                ?.token.address,
                                                    )
                                                }
                                                active={
                                                    !!whitelistedToken &&
                                                    whitelistedToken.token
                                                        .address ===
                                                        value?.address
                                                }
                                                tokenWithBalance={
                                                    whitelistedToken
                                                }
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
                    </animated.div>
                </animated.div>
            ),
    );
}
