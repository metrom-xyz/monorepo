import { useCallback, useState, type ChangeEvent, useMemo } from "react";
import type { Token, Pool } from "@metrom-xyz/sdk";
import { useChainId } from "wagmi";
import { TextInput } from "@/src/ui/text-input";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { SearchIcon } from "@/src/assets/search-icon";
import { useTranslations } from "next-intl";
import type { CampaignPayload } from "@/src/types";
import { usePools } from "@/src/hooks/usePools";
import { Chip } from "@/src/ui/chip/chip";
import { useBaseTokens } from "@/src/hooks/useBaseTokens";
import { RemoteLogo } from "@/src/ui/remote-logo";
import { Typography } from "@/src/ui/typography";
import { useDebounce } from "react-use";
import { filterPools } from "@/src/utils/tokens";
import { Row } from "./row";

import styles from "./styles.module.css";

interface PoolPickerProps {
    value?: Pool;
    amm?: CampaignPayload["amm"];
    onChange: (pool: Pool) => void;
}

export function PoolPicker({ value, amm, onChange }: PoolPickerProps) {
    const t = useTranslations("new_campaign.form.pool");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [baseTokenFilter, setBaseTokenFilter] = useState<Token>();

    const chain = useChainId();
    const baseTokens = useBaseTokens();
    const { pools, loading } = usePools(amm?.slug);

    const filteredPools = useMemo(
        () => filterPools(pools, baseTokenFilter?.address || debouncedSearch),
        [baseTokenFilter?.address, debouncedSearch, pools],
    );

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        300,
        [search],
    );

    const getBaseTokenChangeHandler = useCallback(
        (token: Token) => {
            return () => {
                if (token.address === baseTokenFilter?.address)
                    setBaseTokenFilter(undefined);
                else setBaseTokenFilter(token);
            };
        },
        [baseTokenFilter?.address],
    );

    function handleSearchOnChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <TextInput
                    value={search}
                    onChange={handleSearchOnChange}
                    variant="lg"
                    placeholder={t("searchLabel")}
                    icon={SearchIcon}
                    className={{
                        input: styles.searchInput,
                        inputWrapper: styles.searchInput,
                    }}
                />
                <div className={styles.baseTokensWrapper}>
                    {baseTokens.map((token) => (
                        <Chip
                            key={token.address}
                            clickable
                            active={baseTokenFilter?.address === token.address}
                            onClick={getBaseTokenChangeHandler(token)}
                        >
                            <div className={styles.baseTokenChip}>
                                <RemoteLogo
                                    size="sm"
                                    defaultText={" "}
                                    address={token.address}
                                    chain={chain}
                                />
                                <Typography weight="medium">
                                    {token.symbol}
                                </Typography>
                            </div>
                        </Chip>
                    ))}
                </div>
            </div>
            <div className={styles.listWrapper}>
                <div className={styles.listHeader}>
                    <Typography uppercase weight="medium" light>
                        {t("list.pool")}
                    </Typography>
                    <Typography uppercase weight="medium" light>
                        {t("list.tvl")}
                    </Typography>
                </div>
                {loading || pools.length > 0 ? (
                    <AutoSizer>
                        {({ height, width }) => {
                            return (
                                <FixedSizeList
                                    height={height}
                                    width={width}
                                    itemCount={
                                        loading ? 6 : filteredPools.length
                                    }
                                    itemData={
                                        loading
                                            ? new Array(6).fill(null)
                                            : filteredPools
                                    }
                                    itemSize={57}
                                    className={styles.list}
                                >
                                    {({ index, style }) => {
                                        const pool = filteredPools[index];
                                        return (
                                            <Row
                                                style={style}
                                                loading={loading}
                                                active={
                                                    pool &&
                                                    pool.address ===
                                                        value?.address
                                                }
                                                pool={pool}
                                                onClick={onChange}
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
        </div>
    );
}
