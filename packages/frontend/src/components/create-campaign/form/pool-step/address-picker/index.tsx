import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { useChainId } from "wagmi";
import { usePool } from "@/src/hooks/usePool";
import type { CampaignPayload } from "@/src/types";
import { type Address, isAddress } from "viem";
import { useDebounce } from "react-use";
import { TextInput, Typography } from "@metrom-xyz/ui";
import { SearchIcon } from "@/src/assets/search-icon";
import { Pool, SkeletonPool } from "../pool";
import type { PoolWithTvl } from "@metrom-xyz/sdk";

import styles from "./styles.module.css";

export interface AddressPoolPickerProps {
    dex?: CampaignPayload["dex"];
    onChange: (pool: PoolWithTvl) => void;
    onError: (error: string) => void;
}

export function AddressPoolPicker({
    dex,
    onChange,
    onError,
}: AddressPoolPickerProps) {
    const t = useTranslations("newCampaign.form.pool");
    const [search, setSearch] = useState("");
    const [address, setAddress] = useState<Address>();
    const chainId = useChainId();

    const { pool: importedPool, loading: loadingImportedPool } = usePool(
        chainId,
        address,
    );

    useDebounce(
        () => {
            setAddress(isAddress(search) ? search : undefined);
        },
        300,
        [search],
    );

    useEffect(() => {
        if (search && !address) onError(t("errors.invalidAddress"));
        else if (address && !loadingImportedPool && importedPool === null)
            onError(t("errors.invalidPool"));
        else if (dex && importedPool && importedPool.dex !== dex.slug)
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
    const validPool = !empty && dex && importedPool?.dex === dex?.slug;
    const invalidPool =
        address &&
        !loadingImportedPool &&
        (importedPool === null || (dex && importedPool?.dex !== dex.slug));

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <TextInput
                    value={search}
                    onChange={handleSearchOnChange}
                    placeholder={t("label")}
                    icon={SearchIcon}
                    className={styles.searchInput}
                />
            </div>
            <div className={styles.wrapper}>
                {search && !address && t("errors.invalidAddress")}
                {loadingImportedPool && !importedPool && <SkeletonPool />}
                {!search && empty && <Typography>{t("empty")}</Typography>}
                {validPool && (
                    <Pool
                        chain={chainId}
                        pool={importedPool}
                        onClick={handlePoolOnChange}
                    />
                )}
                {invalidPool && (
                    <Typography>{t("errors.invalidPool")}</Typography>
                )}
            </div>
        </div>
    );
}
