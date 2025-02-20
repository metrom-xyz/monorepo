import {
    useCallback,
    useState,
    type ChangeEvent,
    useMemo,
    useRef,
    useEffect,
} from "react";
import { useDebounce } from "react-use";
import type { Erc20Token, SupportedDex, AmmPoolWithTvl } from "@metrom-xyz/sdk";
import { useChainId } from "wagmi";
import { TextInput, Chip, Typography } from "@metrom-xyz/ui";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { SearchIcon } from "@/src/assets/search-icon";
import { useTranslations } from "next-intl";
import { usePools } from "@/src/hooks/usePools";
import { useBaseTokens } from "@/src/hooks/useBaseTokens";
import { filterPools } from "@/src/utils/filtering";
import { Row } from "./row";
import { RemoteLogo } from "@/src/components/remote-logo";

import styles from "./styles.module.css";

interface ListPoolPickerProps {
    value?: AmmPoolWithTvl;
    dex?: SupportedDex;
    onChange: (pool: AmmPoolWithTvl) => void;
}

export function ListPoolPicker({ value, dex, onChange }: ListPoolPickerProps) {
    const t = useTranslations("newCampaign.form.ammPoolLiquidity.pool");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [baseTokenFilter, setBaseTokenFilter] = useState<Erc20Token>();
    const listRef = useRef(null);

    const chain = useChainId();
    const baseTokens = useBaseTokens(chain);
    const { pools, loading } = usePools(chain, dex);

    const filteredPools = useMemo(
        () =>
            filterPools(
                pools || [],
                baseTokenFilter?.address || debouncedSearch,
            ),
        [baseTokenFilter?.address, debouncedSearch, pools],
    );

    const selectedIndex = useMemo(() => {
        if (!pools) return 0;
        return pools.findIndex((pool) => pool.address === value?.address);
    }, [pools, value?.address]);

    useEffect(() => {
        if (!listRef.current) return;
        (listRef.current as any).scrollToItem(selectedIndex, "start");
    }, [selectedIndex]);

    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        300,
        [search],
    );

    const getBaseTokenChangeHandler = useCallback(
        (token: Erc20Token) => {
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
                    placeholder={t("list.label")}
                    icon={SearchIcon}
                    className={styles.searchInput}
                />
                <div className={styles.baseTokensWrapper}>
                    {baseTokens.map((token) => (
                        <Chip
                            key={token.address}
                            clickable
                            active={baseTokenFilter?.address === token.address}
                            onClick={getBaseTokenChangeHandler(token)}
                            className={{
                                root:
                                    baseTokenFilter &&
                                    baseTokenFilter.address !== token.address
                                        ? styles.baseTokenChipNotActive
                                        : undefined,
                            }}
                        >
                            <div className={styles.baseTokenChip}>
                                <RemoteLogo
                                    size="xs"
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
                    <Typography uppercase size="sm" weight="medium" light>
                        {t("list.pool")}
                    </Typography>
                    <Typography uppercase size="sm" weight="medium" light>
                        {t("list.tvl")}
                    </Typography>
                </div>
                {loading || (pools && pools.length > 0) ? (
                    <AutoSizer>
                        {({ height, width }) => {
                            return (
                                <FixedSizeList
                                    ref={listRef}
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
                                    {({ index, style, data }) => {
                                        const pool: AmmPoolWithTvl =
                                            data[index];
                                        return (
                                            <Row
                                                style={style}
                                                chain={chain}
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
