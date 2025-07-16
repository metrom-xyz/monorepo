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
import { useChainId } from "@/src/hooks/use-chain-id/useChainId";
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
import { CHAIN_TYPE } from "@/src/commons";

interface ListPoolPickerProps {
    value?: AmmPoolWithTvl;
    dex?: SupportedDex;
    onChange: (pool: AmmPoolWithTvl) => void;
}

const LIST_ITEM_HEIGHT = 57;

export function ListPoolPicker({ value, dex, onChange }: ListPoolPickerProps) {
    const t = useTranslations("newCampaign.form.ammPoolLiquidity.pool");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [baseTokenFilter, setBaseTokenFilter] = useState<Erc20Token>();
    const listRef = useRef(null);

    const chainId = useChainId();
    const baseTokens = useBaseTokens(chainId);
    const { pools, loading } = usePools({
        chainId,
        chainType: CHAIN_TYPE,
        dex,
    });

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
        return pools.findIndex((pool) => pool.id === value?.id);
    }, [pools, value?.id]);

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

    const itemCount = Math.max(loading ? 6 : filteredPools.length, 1);

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
                                    chain={chainId}
                                />
                                <Typography weight="medium">
                                    {token.symbol}
                                </Typography>
                            </div>
                        </Chip>
                    ))}
                </div>
            </div>
            <div
                className={styles.listWrapper}
                style={{
                    maxHeight: 384,
                    height: itemCount * LIST_ITEM_HEIGHT + 16,
                }}
            >
                <div className={styles.listHeader}>
                    <Typography uppercase size="sm" weight="medium" light>
                        {t("list.pool")}
                    </Typography>
                    <Typography uppercase size="sm" weight="medium" light>
                        {t("list.tvl")}
                    </Typography>
                </div>
                {loading || (filteredPools && filteredPools.length > 0) ? (
                    <AutoSizer>
                        {({ height, width }) => {
                            return (
                                <FixedSizeList
                                    ref={listRef}
                                    height={height}
                                    width={width}
                                    itemCount={itemCount}
                                    itemData={
                                        loading
                                            ? new Array(6).fill(null)
                                            : filteredPools
                                    }
                                    itemSize={LIST_ITEM_HEIGHT}
                                    className={styles.list}
                                >
                                    {({ index, style, data }) => {
                                        const pool: AmmPoolWithTvl =
                                            data[index];
                                        return (
                                            <Row
                                                style={style}
                                                chain={chainId}
                                                loading={loading}
                                                active={
                                                    pool &&
                                                    pool.id === value?.id
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
