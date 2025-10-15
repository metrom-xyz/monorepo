import {
    useCallback,
    useState,
    type ChangeEvent,
    useMemo,
    useEffect,
} from "react";
import { useDebounce } from "react-use";
import type { Erc20Token, SupportedDex, AmmPoolWithTvl } from "@metrom-xyz/sdk";
import { useChainWithType } from "@/src/hooks/useChainWithType";
import { TextInput, Chip, Typography } from "@metrom-xyz/ui";
import { List, useListCallbackRef } from "react-window";
import { SearchIcon } from "@/src/assets/search-icon";
import { useTranslations } from "next-intl";
import { usePools } from "@/src/hooks/usePools";
import { useBaseTokens } from "@/src/hooks/useBaseTokens";
import { filterPools } from "@/src/utils/filtering";
import { Row } from "./row";
import { RemoteLogo } from "@/src/components/remote-logo";
import { CHAIN_TYPE } from "@/src/commons";

import styles from "./styles.module.css";

interface ListPoolPickerProps {
    open: boolean;
    value?: AmmPoolWithTvl;
    dex?: SupportedDex;
    onChange: (pool: AmmPoolWithTvl) => void;
}

const LIST_ITEM_HEIGHT = 57;

export function ListPoolPicker({
    open,
    value,
    dex,
    onChange,
}: ListPoolPickerProps) {
    const t = useTranslations("newCampaign.form.ammPoolLiquidity.pool");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [baseTokenFilter, setBaseTokenFilter] = useState<Erc20Token>();
    const [list, setList] = useListCallbackRef(null);

    const { id: chainId } = useChainWithType();
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
        if (
            !open ||
            !list ||
            selectedIndex < 0 ||
            selectedIndex > filteredPools.length
        )
            return;

        list.scrollToRow({
            index: selectedIndex,
            align: "start",
            behavior: "instant",
        });
    }, [filteredPools.length, list, open, selectedIndex]);

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
                    <List
                        listRef={setList}
                        rowHeight={LIST_ITEM_HEIGHT}
                        rowCount={itemCount}
                        rowProps={{
                            loading,
                            chain: chainId,
                            value,
                            pools: loading
                                ? new Array(6).fill(null)
                                : (filteredPools as AmmPoolWithTvl[]),
                            onClick: onChange,
                        }}
                        rowComponent={Row}
                        className={styles.list}
                    />
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
