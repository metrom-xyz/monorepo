import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { useChainId } from "wagmi";
import { usePool } from "@/src/hooks/usePool";
import type { AmmPoolLiquidityCampaignPayload } from "@/src/types/common";
import { type Address, isAddress } from "viem";
import { useDebounce } from "react-use";
import { TextInput, Typography } from "@metrom-xyz/ui";
import { SearchIcon } from "@/src/assets/search-icon";
import { Pool, SkeletonPool } from "../pool";
import type { AmmPoolWithTvl } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

export interface AddressPoolPickerProps {
    dex?: AmmPoolLiquidityCampaignPayload["dex"];
    onChange: (pool: AmmPoolWithTvl) => void;
    onError: (error: string) => void;
}

export function AddressPoolPicker({
    dex,
    onChange,
    onError,
}: AddressPoolPickerProps) {
    const t = useTranslations("newCampaign.form.ammPoolLiquidity.pool");
    const [search, setSearch] = useState("");
    const [address, setAddress] = useState<Address>();
    const chainId = useChainId();

    // TODO: a pool's is is not necessarily an address soooo...
    const { pool: importedPool, loading: loadingImportedPool } = usePool({
        chainId,
        id: address,
    });

    useDebounce(
        () => {
            setAddress(isAddress(search) ? search : undefined);
        },
        300,
        [search],
    );

    useEffect(() => {
        if (search && !isAddress(search)) onError(t("errors.invalidAddress"));
        else if (address && !loadingImportedPool && importedPool === null)
            onError(t("errors.invalidPool"));
        else if (dex && importedPool && importedPool.dex.slug !== dex.slug)
            onError(t("errors.inconsistentDex", { dex: dex.name }));
        else onError("");
    }, [address, dex, loadingImportedPool, importedPool, search, t, onError]);

    const handlePoolOnChange = useCallback(() => {
        if (!importedPool) return;
        onChange(importedPool);
        setSearch("");
    }, [importedPool, onChange]);

    function handleSearchOnChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    const empty = !loadingImportedPool && !importedPool;
    const validPool = !empty && dex && importedPool?.dex.slug === dex?.slug;
    const invalidPool =
        address &&
        !loadingImportedPool &&
        (importedPool === null || (dex && importedPool?.dex.slug !== dex.slug));

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <TextInput
                    error={!!search && !isAddress(search)}
                    value={search}
                    onChange={handleSearchOnChange}
                    placeholder={t("label")}
                    icon={SearchIcon}
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.wrapper}>
                {loadingImportedPool && !importedPool && <SkeletonPool />}

                {search && !address && (
                    <Typography uppercase size="xs" weight="medium">
                        {t("errors.enterValidAddress")}
                    </Typography>
                )}

                {invalidPool && (
                    <Typography uppercase size="xs" weight="medium">
                        {t("errors.poolNotSupported")}
                    </Typography>
                )}

                {!search && empty && (
                    <Typography uppercase size="xs" weight="medium">
                        {t("empty")}
                    </Typography>
                )}

                {validPool && (
                    <Pool
                        chain={chainId}
                        pool={importedPool}
                        onClick={handlePoolOnChange}
                    />
                )}
            </div>
        </div>
    );
}
