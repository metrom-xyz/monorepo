"use client";

import { useRef } from "react";
import { useAccount } from "@/src/hooks/useAccount";
import { useChainId } from "@/src/hooks/useChainId";
import { FixedSizeList } from "react-window";
import { useTranslations } from "next-intl";
import { type WhitelistedErc20Token } from "@metrom-xyz/sdk";
import { Typography } from "@metrom-xyz/ui";
import {
    useWatchBalances,
    type Erc20TokenWithBalance,
} from "@/src/hooks/use-watch-balances";
import { Row } from "./row";
import { AnimatePresence, easeInOut, motion } from "motion/react";
import type { WhitelistedErc20TokenAmount } from "@/src/types/common";
import classNames from "classnames";
import { InfoMessage } from "@/src/components/info-message";

import styles from "./styles.module.css";

const TOKENS_LIMIT = 6;

interface WhitelistedTokensListProps {
    open?: boolean;
    loading?: boolean;
    values?: WhitelistedErc20Token[];
    value?: WhitelistedErc20Token;
    unavailable?: WhitelistedErc20TokenAmount[];
    onClick: (token: WhitelistedErc20Token) => void;
    messages?: {
        empty?: string;
    };
}

export function WhitelistedTokensList({
    open = false,
    loading,
    value,
    values,
    unavailable,
    onClick,
    messages,
}: WhitelistedTokensListProps) {
    const t = useTranslations("newCampaign.form.base.rewards");
    const rootRef = useRef<HTMLDivElement>(null);
    const listRef = useRef(null);

    const { address } = useAccount();
    const chainId = useChainId();

    const { tokensWithBalance: tokensWithBalance, loading: loadingBalances } =
        useWatchBalances<WhitelistedErc20Token>({ address, tokens: values });

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial="hide"
                    animate="show"
                    exit="hide"
                    variants={{
                        hide: { height: 0 },
                        show: { height: "auto" },
                    }}
                    transition={{ ease: easeInOut, duration: 0.2 }}
                    className={styles.root}
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
                        {loading || tokensWithBalance.length > 0 ? (
                            <FixedSizeList
                                ref={listRef}
                                height={
                                    loading
                                        ? TOKENS_LIMIT * 57
                                        : Math.min(
                                              tokensWithBalance.length,
                                              TOKENS_LIMIT,
                                          ) * 57
                                }
                                width={"100%"}
                                itemCount={
                                    loading
                                        ? TOKENS_LIMIT
                                        : tokensWithBalance.length
                                }
                                itemData={
                                    loading
                                        ? new Array(TOKENS_LIMIT).fill(null)
                                        : tokensWithBalance
                                }
                                itemSize={57}
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
                                                        whitelistedToken?.token
                                                            .address,
                                                )
                                            }
                                            active={
                                                !!whitelistedToken &&
                                                whitelistedToken.token
                                                    .address === value?.address
                                            }
                                            tokenWithBalance={whitelistedToken}
                                            onClick={onClick}
                                        />
                                    );
                                }}
                            </FixedSizeList>
                        ) : (
                            <div
                                className={classNames(
                                    styles.list,
                                    styles.empty,
                                )}
                            >
                                {/* TODO: add illustration */}
                                <Typography>
                                    {messages?.empty
                                        ? messages.empty
                                        : t("list.empty")}
                                </Typography>
                            </div>
                        )}
                        <InfoMessage
                            text={t("infoMessage")}
                            link="https://github.com/metrom-xyz/monorepo/issues/new?template=whitelist_token.yaml"
                            linkText={t("contactUs")}
                            className={styles.infoText}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
