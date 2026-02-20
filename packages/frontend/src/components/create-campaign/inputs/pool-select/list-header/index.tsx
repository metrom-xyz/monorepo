import { RemoteLogo } from "@/src/components/remote-logo";
import { useBaseTokens } from "@/src/hooks/useBaseTokens";
import { Chip, Typography } from "@metrom-xyz/ui";
import type { Erc20Token } from "@metrom-xyz/sdk";
import { useCallback } from "react";
import { useTranslations } from "next-intl";

import styles from "./styles.module.css";

interface ListHeaderProps {
    chainId?: number;
    baseTokenFilter?: Erc20Token;
    onBaseTokenChange?: (token?: Erc20Token) => void;
}

export function ListHeader({
    chainId,
    baseTokenFilter,
    onBaseTokenChange,
}: ListHeaderProps) {
    const t = useTranslations("newCampaign.inputs");
    const baseTokens = useBaseTokens(chainId);

    const getBaseTokenChangeHandler = useCallback(
        (token: Erc20Token) => {
            return () => {
                let filter;

                if (token.address === baseTokenFilter?.address)
                    filter = undefined;
                else filter = token;

                if (onBaseTokenChange) onBaseTokenChange(filter);
            };
        },
        [baseTokenFilter?.address, onBaseTokenChange],
    );

    return (
        <div className={styles.root}>
            <div className={styles.chips}>
                {baseTokens.map((token) => (
                    <Chip
                        key={token.address}
                        size="xs"
                        variant="secondary"
                        active={baseTokenFilter?.address === token.address}
                        onClick={getBaseTokenChangeHandler(token)}
                    >
                        <div className={styles.baseTokenChip}>
                            <RemoteLogo
                                size="xs"
                                defaultText={" "}
                                address={token.address}
                                chain={chainId}
                                className={styles.logo}
                            />
                            <Typography size="xs" weight="medium">
                                {token.symbol}
                            </Typography>
                        </div>
                    </Chip>
                ))}
            </div>
            <div className={styles.header}>
                <Typography
                    size="xs"
                    weight="medium"
                    variant="tertiary"
                    uppercase
                >
                    {t("pool")}
                </Typography>
                <Typography
                    size="xs"
                    weight="medium"
                    variant="tertiary"
                    uppercase
                >
                    {t("tvl")}
                </Typography>
            </div>
        </div>
    );
}
